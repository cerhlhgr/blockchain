import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Next,
  Param,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersCreateDto } from '../orders/dto/ordersCreateDto';
import { Orders } from '../orders/entities/orders.entity';
import { OrdersInterface } from '../orders/interfaces/orders.interface';
import { WebService } from './web3.service';
import { OrdersMathingDto } from "../orders/dto/ordersMathingDto";

@Controller('web3')
export class Web3Controller {
  constructor(private readonly webService: WebService) {}

  @ApiTags('orders')
  @ApiOperation({ summary: 'Создать заявку.' })
  @ApiBody({ type: OrdersCreateDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ордер успешно создан.',
    type: Orders,
  })
  @Post('/createOrder')
  public async createOrder(
    @Body() body: OrdersCreateDto,
    @Res() res,
    @Next() next,
  ): Promise<OrdersInterface> {
    try {
      const result = await this.webService.createOrder(body);
      return res.send(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiTags('orders')
  @ApiOperation({ summary: 'Отменить заявку.' })
  @ApiParam({ name: 'ordersId', required: true, description: 'id заказа' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Ордер успешно отменен.',
    type: Orders,
  })
  @Post('/cancelOrder/:ordersId')
  public async cancelOrder(
    @Param('ordersId') ordersId: string,
    @Res() res,
    @Next() next,
  ): Promise<OrdersInterface> {
    try {
      const result = await this.webService.cancelOrder(ordersId);
      return res.status(HttpStatus.OK).send(result);
    } catch (err) {
      next(err);
    }
  }

  @ApiTags('orders')
  @ApiOperation({ summary: 'Исполнить заявку.' })
  @ApiBody({ type: OrdersCreateDto })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Ордер успешно создан.',
    type: Orders,
  })
  @Post('/matchOrders')
  public async matchOrders(
    @Body() body: OrdersMathingDto,
    @Res() res,
    @Next() next,
  ): Promise<OrdersInterface> {
    try {
      const result = await this.webService.matchOrders(body);
      return res.send(result);
    } catch (err) {
      next(err);
    }
  }
}
