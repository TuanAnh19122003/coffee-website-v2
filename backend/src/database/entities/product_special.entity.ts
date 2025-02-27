import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";

@Entity("product_specials")
export class ProductSpecial {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.specials, { onDelete: 'CASCADE' })
    product: Product;

    @Column()
    special_name: string;

    @Column("decimal", { precision: 5, scale: 2 })
    discount_percentage: number;

    @Column({ type: "datetime", nullable: true })
    start_date: Date;

    @Column({ type: "datetime", nullable: true })
    end_date: Date;
}