import { Entity,Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { UserRole } from "src/database/entities/userrole.entity";

@Entity("roles")
export class Role{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];
}