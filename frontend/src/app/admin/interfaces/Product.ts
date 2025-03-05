import { Category } from "./Category";
import { Product_size } from "./Product_size";

export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
    sizes: Product_size[];
    discountPercentage?: number;  // Thêm discountPercentage vào Product
}
