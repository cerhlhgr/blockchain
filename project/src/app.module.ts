import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersModule } from './orders/orders.module';
import { Orders } from './orders/entities/orders.entity';
import { web3Module } from './web3/web3.module';
import { Web3Module } from 'nest-web3';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_LOGIN,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Orders],
      synchronize: true,
    }),
    Web3Module.forRoot({
      name: 'eth',
      url: process.env.INFURA_API_URL,
    }),
    OrdersModule,
    web3Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
