import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { ProductSpecial } from "./product_special.entity";

@Entity("specials")
export class Special {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    special_name: string;

    @Column("decimal", { precision: 5, scale: 2, nullable: true, default: 0 })
    discount_percentage: number;    

    @Column({ type: "datetime" })
    start_date: Date;

    @Column({ type: "datetime"})
    end_date: Date;

    @OneToMany(() => ProductSpecial, productSpecial => productSpecial.special)
    productSpecials: ProductSpecial[];
}
