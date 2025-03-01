import { Product } from "./Product";

export interface Product_special{
    id: number;
    special_name: string;
    discount_percentage: number;
    start_date: Date;
    end_date: Date;
    product: Product
}