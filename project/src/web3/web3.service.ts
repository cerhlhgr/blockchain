import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';

import { HttpService } from '@nestjs/axios';
import { Web3Service } from 'nest-web3';
import { OrdersService } from '../orders/orders.service';
import { OrdersInterface } from '../orders/interfaces/orders.interface';
import { OrdersMathingDto } from '../orders/dto/ordersMathingDto';
import { OrdersMatchInterface } from '../orders/interfaces/ordersMatch.interface';

@Injectable()
export class WebService implements OnModuleInit {
  client;
  signer;
  myContract;
  constructor(
    private readonly httpService: HttpService,
    private readonly web3Service: Web3Service,
    private readonly ordersService: OrdersService,
  ) {}

  onModuleInit() {
    this.init();
  }

  private async init(): Promise<void> {
    this.client = this.web3Service.getClient('eth');
    await this.getContract();
    await this.getSigner();
    // await this.getPastEvents();
    await this.subscribe();
  }

  public async getPastEvents(): Promise<void> {
    const eventsCall = {
      OrderCreated: (returnValues) => this.ordersService.addOrder(returnValues),
      OrderCancelled: (returnValues) =>
        this.ordersService.cancelOrder(returnValues),
      OrderMatched: (returnValues) =>
        this.ordersService.matchOrders(returnValues),
    };
    await this.myContract
      .getPastEvents(
        'OrderMatched',
        {
          fromBlock: 'earliest',
        },
        function (error, events) {
          console.log(events);
        },
      )
      .then(function (events) {
        for (const event of events) {
          eventsCall[event.event]
            ? eventsCall[event.event](event.returnValues)
            : console.log('Метод не найден.');
        }
        console.log(events);
      });
  }

  public async subscribe() {
    const eventsCall = {
      OrderCreated: (returnValues) => this.ordersService.addOrder(returnValues),
      OrderCancelled: (returnValues) =>
        this.ordersService.cancelOrder(returnValues),
      OrderMatched: (returnValues) =>
        this.ordersService.matchOrders(returnValues),
    };
    await this.myContract.events
      .allEvents({})
      .on('connected', function (subscriptionId) {
        console.log('subscriptionId: ', subscriptionId);
      })
      .on('data', function (event) {
        eventsCall[event.event]
          ? eventsCall[event.event](event.returnValues)
          : console.log('Метод не найден.');
      });
  }

  private async getContract(): Promise<void> {
    if (this.myContract) return;
    const address: string = process.env.CONTRACT;
    const getData = await this.httpService.axiosRef.get(
      'https://api-rinkeby.etherscan.io/api',
      {
        params: {
          address: address,
          action: 'getabi',
          module: 'contract',
        },
      },
    );

    if (getData?.data?.status != '1' || !getData?.data?.result) {
      throw new HttpException(
        { message: 'Ошибка при получении ABI контракта.' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const abi: any = JSON.parse(getData.data.result);

    this.myContract = new this.client.eth.Contract(abi, address);
  }

  private async getSigner(): Promise<void> {
    this.signer = await this.client.eth.accounts.privateKeyToAccount(
      process.env.SIGNER_PRIVATE_KEY,
    );
    await this.client.eth.accounts.wallet.add(this.signer);
  }

  public async createOrder(createBody): Promise<OrdersInterface> {
    if (
      !this.client.utils.isAddress(createBody.addressTokenA) ||
      !this.client.utils.isAddress(createBody.addressTokenB)
    )
      throw new HttpException(
        { message: 'Один или несколько адресов неверны.' },
        HttpStatus.BAD_REQUEST,
      );

    const tx = await this.myContract.methods.createOrder(
      createBody.addressTokenA,
      createBody.addressTokenB,
      createBody.amountA,
      createBody.amountB,
    );
    const receipt = await tx.send({
      from: this.signer.address,
      gas: await tx.estimateGas({
        from: this.signer.address,
      }),
    });

    if (!receipt?.events?.OrderCreated?.returnValues)
      throw new HttpException(
        { message: 'Ошибка при выполнении.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );

    const returnsValues = receipt?.events?.OrderCreated?.returnValues;

    const resCreateOrdersBody: OrdersInterface = {
      ordersId: returnsValues.id,
      amountA: returnsValues.amountA,
      amountB: returnsValues.amountB,
      tokenA: returnsValues.tokenA,
      tokenB: returnsValues.tokenB,
      user: returnsValues.user,
      isMarket: returnsValues.isMarket,
    };
    return resCreateOrdersBody;
  }

  public async cancelOrder(ordersId: string): Promise<OrdersInterface> {
    const tx = await this.myContract.methods.cancelOrder(ordersId);

    const receipt = await tx.send({
      from: this.signer.address,
      gas: await tx.estimateGas({
        from: this.signer.address,
      }),
    });

    if (!receipt?.events?.OrderCancelled?.returnValues)
      throw new HttpException(
        { message: 'Ошибка при выполнении.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    const returnsValues = receipt?.events?.OrderCancelled?.returnValues;

    const resCancelOrdersBody: OrdersInterface = {
      ordersId: returnsValues.id,
      amountA: returnsValues.amountA,
      amountB: returnsValues.amountB,
      tokenA: returnsValues.tokenA,
      tokenB: returnsValues.tokenB,
      user: returnsValues.user,
      isActive: false,
      isMarket: returnsValues.isMarket,
    };
    return resCancelOrdersBody;
  }

  public async matchOrders(
    matchBody: OrdersMathingDto,
  ): Promise<OrdersMatchInterface> {
    if (
      !this.client.utils.isAddress(matchBody.addressTokenA) ||
      !this.client.utils.isAddress(matchBody.addressTokenB)
    )
      throw new HttpException(
        { message: 'Один или несколько адресов неверны.' },
        HttpStatus.BAD_REQUEST,
      );

    const tx = await this.myContract.methods.matchOrders(
      matchBody.ids,
      matchBody.addressTokenA,
      matchBody.addressTokenB,
      matchBody.amountA,
      matchBody.amountB,
      matchBody.isMarket,
    );

    const receipt = await tx.send({
      from: this.signer.address,
      gas: await tx.estimateGas({
        from: this.signer.address,
      }),
    });

    return receipt?.events?.OrderMatched?.returnValues;
  }
}
