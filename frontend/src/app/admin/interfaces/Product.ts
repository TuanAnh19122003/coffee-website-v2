import { Category } from "./Category";

export interface Product {
    id: number;
    name: string;
    description: string;
    image: string;
    createdAt: Date;
    updatedAt: Date;
    category: Category;
}
