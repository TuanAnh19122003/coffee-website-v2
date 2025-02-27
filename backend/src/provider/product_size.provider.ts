import { DataSource } from "typeorm";
import { ProductSize } from "src/database/entities/product_size.entity";

export const productSizeProvider = [
    {
        provide: 'PRODUCT_SIZE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductSize),
        inject: ['DATA_SOURCE'],
    },
]