import { Injectable, NestMiddleware, ForbiddenException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const user = (req as any).session?.user; // Lấy user từ session

        if (!user) {
            return res.status(401).json({ message: 'Bạn chưa đăng nhập!' });
        }

        if (!user.role.includes('Admin')) {
            return res.status(403).json({ message: 'Bạn không có quyền truy cập trang này!' });
        }

        next(); // Nếu là Admin thì tiếp tục xử lý request
    }
}
