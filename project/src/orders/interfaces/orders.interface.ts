export interface OrdersInterface {
  id?: number;

  ordersId: string;

  amountA: number;

  amountB: number;

  tokenA: string;

  tokenB: string;

  user: string;

  isActive?: boolean;

  isMarket: boolean;
}
