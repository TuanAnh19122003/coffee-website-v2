import { DataSource } from 'typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { CartItem } from 'src/database/entities/cart_item.entity';
import { ProductSize } from 'src/database/entities/product_size.entity';
import { User } from 'src/database/entities/user.entity';

export const cartProviders = [
    {
        provide: 'CART_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Cart),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'CART_ITEM_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CartItem),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'PRODUCT_SIZE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductSize),
        inject: ['DATA_SOURCE'],
    },
    {
        provide: 'USER_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: ['DATA_SOURCE'],
    },
];
