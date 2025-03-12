import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post('add')
  async addToCart(@Req() req, @Body() body) {
    console.log("🛒 Dữ liệu từ frontend:", body);

    if (!req.session || !req.session.user) {
      return { message: 'Bạn chưa đăng nhập', statusCode: 403 };
    }

    const userId = req.session.user.id; // Lấy userId từ session
    const { productId, sizeId, quantity } = body;

    return this.cartService.addToCart(userId, productId, sizeId, quantity);
  }

}
