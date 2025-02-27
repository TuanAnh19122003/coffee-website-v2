import { DataSource } from "typeorm";
import { CartItem } from "src/database/entities/cart_item.entity";

export const cartitemProvider = [
    {
        provide: 'CARTITEM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
        inject: ['DATA_SOURCE'],
    },
]