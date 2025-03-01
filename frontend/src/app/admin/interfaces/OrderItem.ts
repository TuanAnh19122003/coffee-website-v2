import { Order } from "./Order";
import { Product } from "./Product";
import { Product_size } from "./Product_size";

export interface OrderItem{
    id: number;
    quantity: number;
    price: number;
    product: Product;
    order: Order;
    size: Product_size;
}