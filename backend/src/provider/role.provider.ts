import { DataSource } from "typeorm";
import { Role } from "src/database/entities/role.entity";

export const roleProvider = [
    {
        provide: 'ROLE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
        inject: ['DATA_SOURCE'],
    },
]