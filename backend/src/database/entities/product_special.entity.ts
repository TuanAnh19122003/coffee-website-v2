import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { Special } from "./special.entity";

@Entity("product_specials")
export class ProductSpecial {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Product, product => product.specials, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToOne(() => Special, special => special.productSpecials, { onDelete: 'CASCADE',eager: true })
    special: Special;
}
