import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { OrderItem } from "./order_item.entity";
import { OrderStatus } from "src/modules/orders/order-status.enum";

export enum PaymentStatus {
    PAID = 'paid',
    UNPAID = 'unpaid',
}

@Entity("orders")
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    order_date: Date;

    @UpdateDateColumn()
    orderUpdateDate: Date;

    @Column({ type: 'text' })
    shipping_address: string;

    @Column("decimal", { precision: 10, scale: 2 })
    total_price: number;

    @Column({ type: "enum", enum: OrderStatus, default: OrderStatus.PENDING })
    status: OrderStatus;

    @OneToMany(() => OrderItem, orderItem => orderItem.order, { eager: true })
    orderItems: OrderItem[];

    @Column({ default: 'paypal' })
    paymentMethod: string;

    @Column({ type: "enum", enum: PaymentStatus, default: PaymentStatus.UNPAID })
    paymentStatus: PaymentStatus;

    @Column({ nullable: true })
    paymentId: string;

    @Column({ nullable: true })
    payerId: string;
}