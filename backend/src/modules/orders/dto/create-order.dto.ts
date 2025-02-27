import { OrderStatus } from "../order-status.enum";

export class CreateOrderDto {
    total_price: number;
    userId: number;
    status: OrderStatus;
}
