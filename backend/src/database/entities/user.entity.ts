import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "src/database/entities/userrole.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    image: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    address: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP',onUpdate: 'CURRENT_TIMESTAMP',})
    updatedAt?: Date;

    @OneToMany(() => UserRole, userRole => userRole.user)
    userRoles: UserRole[];
}