import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Cart } from "./cart.entity";
import { Product } from "./product.entity";
import { ProductSize } from "./product_size.entity";

@Entity("cart_items")
export class CartItem{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Cart, cart => cart.cartItems, { onDelete: 'CASCADE' })
    cart: Cart;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToOne(() => ProductSize, { onDelete: 'CASCADE' })
    size: ProductSize;

    @Column()
    quantity: number;

    @Column("decimal", { precision: 10, scale: 2, default: 0 })
    price: number;
}