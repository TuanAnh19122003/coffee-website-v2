export class CreateUserDto {
    email: string;
    password: string;
    image?: string;
    firstname: string;
    lastname: string;
    phone?: string;
    address?: string;
    resetToken?: string;
    resetTokenExpire?: Date;
}
