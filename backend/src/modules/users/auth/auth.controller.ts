import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, Session, Req, Res, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import session from 'express-session';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: CreateUserDto, @Res() res: Response, @Req() req: Request) {
        try {
            if (!(req as any).session) {
                throw new InternalServerErrorException('Session chưa được khởi tạo');
            }
            const user = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!user) throw new UnauthorizedException('Mật khẩu không đúng');
            (req as any).session.user = {
                id: user.id,
                email: user.email,
                role: user?.userRoles?.map(ur => ur.role.name),
                lastname: user.lastname,
                firstname: user.firstname,
                image: user.image,
                phone: user.phone,
                address: user.address,
            };
            console.log((req as any).session.user)

            return res.status(200).json({ message: 'Đăng nhập thành công!', user: (req as any).session.user });
        } catch (error) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' });
        }
    }

    @Get()
    async getAuthSession(
        @Session() session: Record<string, string>
    ) {
        console.log(session);
        console.log(session.id);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
        try {
            await this.authService.register(createUserDto);
            return res.status(201).json({ message: 'Đăng ký thành công!' });
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }

    @Post('logout')
    async logout(@Res() res: Response, @Req() req: Request) {
        (req as any).session.destroy((err) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: 'Có lỗi xảy ra khi đăng xuất!' });
            }
            return res.status(200).json({ message: 'Đăng xuất thành công!' });
        });
    }

    @Get('/user')
    async getUser(@Session() session) {
        return { user: session.user || null };
    }
}
