import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { Category } from "./category.entity";
import { ProductSize } from "./product_size.entity";
import { ProductSpecial } from "./product_special.entity";

@Entity("products")
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Category, category => category.products, { onDelete: 'CASCADE' })
    category: Category;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    image: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP',onUpdate: 'CURRENT_TIMESTAMP',})
    updatedAt?: Date;

    @OneToMany(() => ProductSize, size => size.product)
    sizes: ProductSize[];

    @OneToMany(() => ProductSpecial, special => special.product)
    specials: ProductSpecial[];
}