import { DataSource } from "typeorm";
import { Special } from "src/database/entities/special.entity";

export const specialProvider = [
    {
        provide: 'SPECIAL_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Special),
        inject: ['DATA_SOURCE'],
    },
]