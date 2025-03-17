import { OrderItem } from "src/database/entities/order_item.entity";
import { OrderStatus } from "../order-status.enum";

export class CreateOrderDto {
    total_price: number;
    userId: number;
    status: OrderStatus;
    orderItems: OrderItem[];
}
