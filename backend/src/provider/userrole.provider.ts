import { DataSource } from "typeorm";
import { UserRole } from "src/database/entities/userrole.entity";
export const userroleProvider = [
    {
        provide: 'USERROLE_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(UserRole),
        inject: ['DATA_SOURCE'],
    },
]