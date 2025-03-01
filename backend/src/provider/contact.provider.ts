import { DataSource } from "typeorm";
import { Contact } from "src/database/entities/contact.entity";

export const contactProvider = [
    {
        provide: 'CONTACT_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Contact),
        inject: ['DATA_SOURCE'],
    },
]