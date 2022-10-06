import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class OrdersCreateDto {
  @ApiProperty({ description: 'Токен пользователя А', nullable: false })
  @IsNotEmpty()
  @IsString()
  public addressTokenA: string;

  @ApiProperty({ description: 'Токен пользователя B', nullable: false })
  @IsNotEmpty()
  @IsString()
  public addressTokenB: string;

  @ApiProperty({ description: 'цена пользователя А', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  public amountA: number;

  @ApiProperty({ description: 'цена пользователя B', nullable: false })
  @IsNotEmpty()
  @IsNumber()
  public amountB: number;
}
