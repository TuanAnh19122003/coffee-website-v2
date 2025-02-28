import { User } from '../interfaces/User';
import { Role } from '../interfaces/Role';

export interface UserRole{
    id: number;
    user: User;
    role: Role;
}