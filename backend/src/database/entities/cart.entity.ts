import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { CartItem } from "./cart_item.entity";

@Entity("cart")
export class Cart {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP',onUpdate: 'CURRENT_TIMESTAMP',})
    updatedAt?: Date;

    @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
    cartItems: CartItem[];
}