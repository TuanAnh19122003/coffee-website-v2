import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "src/database/entities/user.entity";
import { Role } from "src/database/entities/role.entity";

@Entity("user_roles")
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.userRoles, { onDelete: 'CASCADE'})
    user: User;

    @ManyToOne(() => Role, role => role.userRoles, { onDelete: 'CASCADE'})
    role: Role;
}