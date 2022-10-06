import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/orders.entity';

@Module({
  controllers: [OrdersController],
  imports: [TypeOrmModule.forFeature([Orders])],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
