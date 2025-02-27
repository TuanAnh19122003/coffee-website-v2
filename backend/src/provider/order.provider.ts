import { DataSource } from "typeorm";
import { Order } from "src/database/entities/order.entity";

export const orderProvider = [
    {
        provide: 'ORDER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Order),
        inject: ['DATA_SOURCE'],
    },
]