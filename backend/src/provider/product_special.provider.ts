import { DataSource } from "typeorm";
import { ProductSpecial } from "src/database/entities/product_special.entity";

export const productSpecialProvider = [
    {
        provide: 'PRODUCT_SPECIAL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ProductSpecial),
        inject: ['DATA_SOURCE'],
    },
]