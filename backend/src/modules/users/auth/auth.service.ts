import { Injectable, UnauthorizedException, BadRequestException, forwardRef, Inject } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UserrolesService } from 'src/modules/userroles/userroles.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { BcryptHelper } from 'src/utils/bcrypt.helper';
import { MailerService } from 'src/utils/mailer.service';
import { randomBytes } from 'crypto';


@Injectable()
export class AuthService {
    constructor(
        @Inject()
        private readonly usersService: UsersService,
        private readonly userrolesService: UserrolesService,
        private readonly mailerService: MailerService,
    ) { }
    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        // console.log(user?.userRoles?.map(ur => ur.role.name));
        // console.log("User found:", user, user?.userRoles?.map(ur => ur.role.name));

        if (!user) throw new UnauthorizedException('Tài khoản không tồn tại');

        const isPasswordValid = await BcryptHelper.comparePassword(password, user.password);
        console.log("Password valid:", isPasswordValid);

        if (!isPasswordValid) throw new UnauthorizedException('Mật khẩu không đúng');

        return user;
    }


    async login(email: string, password: string) {
        return await this.validateUser(email, password);
    }

    async register(createUserDto: CreateUserDto) {
        const { email, password, firstname, lastname } = createUserDto;

        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
            throw new BadRequestException('Email đã được sử dụng');
        }

        const newUser = await this.usersService.create({
            ...createUserDto,
        });
        const newUserRole = await this.userrolesService.create({
            userId: newUser.id,
            roleId: 2,
        })

        return { message: 'Đăng ký thành công', user: newUser, userRole: newUserRole };
    }

    async forgotPassword(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new BadRequestException('Email không tồn tại');

        const resetToken = randomBytes(32).toString('hex');
        const resetTokenExpire = new Date(Date.now() + 3600000);

        await this.usersService.update(user.id, { resetToken, resetTokenExpire });

        const resetLink = `${process.env.CORS_ORIGIN}/coffee/auth/reset-password?token=${resetToken}`;
        await this.mailerService.sendMail(user.email, 'Reset Password', `Click vào link để đặt lại mật khẩu: ${resetLink}`);

        return { message: 'Email đặt lại mật khẩu đã được gửi' };
    }

    async resetPassword(token: string, newPassword: string) {
        const user = await this.usersService.findByResetToken(token);
        if (!user || !user.resetTokenExpire || user.resetTokenExpire < new Date()) {
            throw new BadRequestException('Token không hợp lệ hoặc đã hết hạn');
        }

        const hashedPassword = await BcryptHelper.hashPassword(newPassword);
        await this.usersService.update(user.id, { password: hashedPassword, resetToken: undefined, resetTokenExpire: undefined });

        return { message: 'Mật khẩu đã được cập nhật' };
    }

}
