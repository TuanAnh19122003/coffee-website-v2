import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity("product_sizes")
export class ProductSize {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.sizes, { onDelete: 'CASCADE' })
    product: Product;

    @Column()
    size: string;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;
}