import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Next,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersInterface } from './interfaces/orders.interface';
import {
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { OrdersCreateDto } from './dto/ordersCreateDto';
import { Orders } from './entities/orders.entity';
import { OrdersQueryDto } from './dto/ordersQueryDto';
import { OrdersQueryMatchingDto } from "./dto/ordersQueryMatchingDto";

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiTags('orders')
  @ApiOperation({ summary: 'Получить массив заявок.' })
  @ApiQuery({ name: 'tokenA', required: false, description: 'tokenA' })
  @ApiQuery({ name: 'tokenB', required: false, description: 'tokenB' })
  @ApiQuery({ name: 'user', required: false, description: 'user' })
  @ApiQuery({ name: 'active', required: false, description: 'active' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Завявки по заросу',
    type: [Orders],
  })
  @Get('getOrders')
  public async getOrders(
    @Query() query: OrdersQueryDto,
    @Next() next,
    @Res() res,
  ): Promise<OrdersInterface[]> {
    try {
      const orders = await this.ordersService.getOrders(query);
      return res.send(orders);
    } catch (err) {
      next(err);
    }
  }

  @ApiTags('orders')
  @ApiOperation({ summary: 'Получить массив заявок.' })
  @ApiQuery({ name: 'tokenA', required: false, description: 'tokenA' })
  @ApiQuery({ name: 'tokenB', required: false, description: 'tokenB' })
  @ApiQuery({ name: 'amountA', required: false, description: 'amountA' })
  @ApiQuery({ name: 'amountB', required: false, description: 'amountB' })
  @ApiResponse({
    status: HttpStatus.OK,
    description:
      'Возвращает массив идентификаторов заявок, для вызова метода matchOrders в смарт контракте',
    type: [Orders],
  })
  @Get('getMatchingOrders')
  public async getMatchingOrders(
    @Query() query: OrdersQueryMatchingDto,
    @Next() next,
    @Res() res,
  ): Promise<OrdersInterface[]> {
    try {
      const orders = await this.ordersService.getMatchingOrders(query);
      return res.send(orders);
    } catch (err) {
      next(err);
    }
  }
}
