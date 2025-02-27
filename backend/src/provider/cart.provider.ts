import { DataSource } from "typeorm";
import { Cart } from "src/database/entities/cart.entity";

export const cartProvider = [
    {
        provide: 'CART_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Cart),
        inject: ['DATA_SOURCE'],
    },
]