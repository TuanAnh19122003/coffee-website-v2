import { OrderItem } from "./OrderItem";
import { User } from "./User";

export enum OrderStatus{
    PENDING = 'pending',
    COMPLETED = 'completed',
    CANCELLED = 'cancelled'
}

export interface Order{
    id: number;
    order_date: Date;
    total_price: number;
    status: OrderStatus;
    shipping_address: string;
    user: User;
    orderItems?: OrderItem[];
}