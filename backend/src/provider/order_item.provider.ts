import { DataSource } from "typeorm";
import { OrderItem } from "src/database/entities/order_item.entity";

export const orderItemProvider = [
    {
        provide: 'ORDER_ITEM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(OrderItem),
        inject: ['DATA_SOURCE'],
    },
]