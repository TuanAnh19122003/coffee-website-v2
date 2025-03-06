import { Product } from "./Product";

export interface Product_size{
    id: number;
    size: string;
    price: number;
    product: Product;
    discounted_price?: number;
}