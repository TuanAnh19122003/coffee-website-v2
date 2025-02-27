import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order_item.entity";

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    order_date: Date;

    @Column("decimal", { precision: 10, scale: 2 })
    total_price: number;

    @Column({ default: "Pending" })
    status: string;

    @OneToMany(() => OrderItem, orderItem => orderItem.order)
    orderItems: OrderItem[];
}