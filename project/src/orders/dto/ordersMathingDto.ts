import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class OrdersMathingDto {
  @ApiProperty({ description: 'id ордеров', nullable: false })
  @IsNotEmpty()
  @IsArray()
  public ids: string[];

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

  @ApiProperty({ description: 'рыночная или нет', nullable: false })
  @IsNotEmpty()
  @IsBoolean()
  public isMarket: boolean;
}
