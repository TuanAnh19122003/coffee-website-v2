import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Product } from "./product.entity";
import { ProductSize } from "./product_size.entity";
import { Order } from "./order.entity";

@Entity("order_items")
export class OrderItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'CASCADE' })
    order: Order;

    @ManyToOne(() => Product, { onDelete: 'CASCADE' })
    product: Product;

    @ManyToOne(() => ProductSize, { onDelete: 'CASCADE' })
    size: ProductSize;

    @Column()
    quantity: number;

    @Column("decimal", { precision: 10, scale: 2 })
    price: number;
}