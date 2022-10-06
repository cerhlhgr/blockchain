import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Orders {
  @ApiProperty({ description: 'id', nullable: false })
  @PrimaryGeneratedColumn()
  public id: number;

  @ApiProperty({ description: 'id ордера', nullable: false })
  @Column({ nullable: false, unique: true })
  public ordersId: string;

  @ApiProperty({ description: 'цена А', nullable: false })
  @Column({ nullable: false })
  public amountA: number;

  @ApiProperty({ description: 'цена B', nullable: false })
  @Column({ nullable: false })
  public amountB: number;

  @ApiProperty({ description: 'Токен А', nullable: false })
  @Column({ nullable: false })
  public tokenA: string;

  @ApiProperty({ description: 'Токен  B', nullable: false })
  @Column({ nullable: false })
  public tokenB: string;

  @ApiProperty({ description: 'id пользователя', nullable: false })
  @Column({ nullable: false })
  public user: string;

  @ApiProperty({ description: 'Статус активности для мерджа', nullable: false })
  @Column({ default: true })
  public isActive: boolean;

  @ApiProperty({ description: 'Статус маркета', nullable: false })
  @Column({ nullable: false })
  public isMarket: boolean;
}
