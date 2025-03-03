import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseInterceptors, UploadedFile, Req, Res, UnauthorizedException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UsersService } from '../users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: CreateUserDto, @Res() res: Response) {
        try {
            const user = await this.authService.validateUser(loginDto.email, loginDto.password);
            if (!user) throw new UnauthorizedException('Mật khẩu không đúng');
    
            return res.status(200).json({ message: 'Đăng nhập thành công!', user });
        } catch (error) {
            return res.status(401).json({ message: 'Sai email hoặc mật khẩu!' }); 
        }
    }
}
