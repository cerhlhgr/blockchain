export interface OrdersMatchInterface {
  id: string;

  matchedId: number;

  amountReceived: number;

  amountPaid: number;

  amountLeftToFill: number;

  fee: number;

  feeRate: number;
}
