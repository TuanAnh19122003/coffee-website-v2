import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('contacts')
export class Contact{
    @PrimaryGeneratedColumn()
    id?: number;
  
    @Column({ type: 'varchar', length: 255 })
    firstName?: string;
  
    @Column({ type: 'nvarchar', length: 255 })
    lastName?: string;
  
    @Column({ type: 'nvarchar', length: 255 })
    email?: string;
  
    @Column({ type: 'nvarchar', length: 20 })
    phoneNumber?: string;
  
    @Column({ type: 'nvarchar', length: 255 })
    subjectName?: string;
  
    @Column({ length: 500, nullable: true })
    note?: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP',onUpdate: 'CURRENT_TIMESTAMP',})
    updatedAt?: Date;
}