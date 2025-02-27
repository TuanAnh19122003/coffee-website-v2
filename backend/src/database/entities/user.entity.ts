import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "src/database/entities/userrole.entity";

@Entity("users")
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    image: string;

    @Column({ nullable: true })
    firstname: string;

    @Column({ nullable: true })
    lastname: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    createdAt?: Date;

    @Column({type: 'datetime', default: () => 'CURRENT_TIMESTAMP',onUpdate: 'CURRENT_TIMESTAMP',})
    updatedAt?: Date;

    @OneToMany(() => UserRole, userRole => userRole.user)
    userRoles: UserRole[];
}