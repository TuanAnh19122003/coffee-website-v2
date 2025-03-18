import { Category } from "./Category";
import { Product_size } from "./Product_size";

export interface Product {
    id: number;
    name: string;
    description?: string;
    image?: string;
    sizes: Product_size[];
    createdAt: Date;
    updatedAt: Date;
    category: Category;
    special_name?: string;
    start_date?: string;
    end_date?: string;
    originalPrice?: number;   
    discountedPrice?: number; 
}
