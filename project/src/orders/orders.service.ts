import {
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { OrdersInterface } from './interfaces/orders.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';
import { Repository } from 'typeorm';
import { WebService } from '../web3/web3.service';
import { OrdersCreateDto } from './dto/ordersCreateDto';
import { OrdersQueryDto } from './dto/ordersQueryDto';
import { OrdersQueryMatchingDto } from './dto/ordersQueryMatchingDto';
import { OrdersMatchInterface } from './interfaces/ordersMatch.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Orders)
    private readonly ordersModel: Repository<Orders>,
  ) {}

  public async addOrder(returnsValues): Promise<void> {
    try {
      const resCreateOrdersBody: OrdersInterface = {
        ordersId: returnsValues.id,
        amountA: returnsValues.amountA,
        amountB: returnsValues.amountB,
        tokenA: returnsValues.tokenA,
        tokenB: returnsValues.tokenB,
        user: returnsValues.user,
        isMarket: returnsValues.isMarket,
      };
      await this.ordersModel.save(resCreateOrdersBody);
    } catch (err) {
      console.log(err);
    }
  }

  public async deleteOrder(returnsValues): Promise<void> {
    try {
      const ordersId: string = returnsValues.id;
      await this.ordersModel.delete({ ordersId: ordersId });
    } catch (err) {
      console.log(err);
    }
  }

  public async cancelOrder(returnsValues): Promise<void> {
    try {
      const ordersId: string = returnsValues.id;
      await this.ordersModel.update(
        { ordersId: ordersId },
        { isActive: false },
      );
    } catch (err) {
      console.log(err);
    }
  }

  public async matchOrders(returnsValues: OrdersMatchInterface): Promise<void> {
    try {
      const order = await this.ordersModel.findOne({
        where: { ordersId: returnsValues.id },
      });
      console.log(order, returnsValues);
      if (order){
        if (order.amountA == returnsValues.amountLeftToFill) {
          console.log('совпали')
          await this.ordersModel.update(
            { ordersId: returnsValues.id },
            { isActive: false }
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async getOrders(query: OrdersQueryDto): Promise<OrdersInterface[]> {
    const builder = await this.ordersModel.createQueryBuilder('orders');

    if (query.tokenA)
      await builder.andWhere('orders.tokenA = :tokenA', {
        tokenA: query.tokenA,
      });

    if (query.tokenB)
      await builder.andWhere('orders.tokenB = :tokenB', {
        tokenB: query.tokenB,
      });

    if (query.user)
      await builder.andWhere('orders.user = :user', { user: query.user });

    await builder.andWhere('orders.isActive = :isActive', {
      isActive: query.active ? JSON.parse(query.active) : true,
    });
    const orders: OrdersInterface[] = await builder.getMany();
    return orders;
  }

  public async getMatchingOrders(
    query: OrdersQueryMatchingDto,
  ): Promise<OrdersInterface[]> {
    const builder = await this.ordersModel.createQueryBuilder('orders');

    if (query.tokenA)
      await builder.andWhere('orders.tokenA = :tokenA', {
        tokenA: query.tokenA,
      });

    if (query.tokenB)
      await builder.andWhere('orders.tokenB = :tokenB', {
        tokenB: query.tokenB,
      });

    if (query.amountA)
      await builder.andWhere('orders.amountA = :amountA', {
        amountA: query.amountA,
      });

    if (query.amountA == 0)
      await builder.andWhere('orders.isMarket = :isMarket', {
        isMarket: true,
      });

    if (query.amountB)
      await builder.andWhere('orders.amountB = :amountB', {
        amountB: query.amountB,
      });

    await builder.andWhere('orders.isActive = :isActive', {
      isActive: true,
    });
    const orders: OrdersInterface[] = await builder.getMany();
    return orders;
  }
}
