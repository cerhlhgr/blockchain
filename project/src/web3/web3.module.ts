import { forwardRef, Module } from "@nestjs/common";
import { WebService } from "./web3.service";
import { OrdersModule } from '../orders/orders.module';
import { OrdersService } from '../orders/orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from '../orders/entities/orders.entity';
import { HttpModule } from "@nestjs/axios";
import { Web3Controller } from './web3.controller';

@Module({
  imports: [
    OrdersModule,
    HttpModule,
    TypeOrmModule.forFeature([Orders]),
  ],
  providers: [WebService, OrdersService],
  exports: [WebService],
  controllers: [Web3Controller],
})
export class web3Module {}
