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

    @Column("decimal", { precision: 5, scale: 2, nullable: true, default: 0 })
    discount_percentage: number;    

    @Column({ type: "datetime" })
    start_date: Date;

    @Column({ type: "datetime"})
    end_date: Date;
}