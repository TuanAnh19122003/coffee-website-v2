import { Controller, Post, Body, Req, UseGuards, Get, Query, Delete, Put } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }


  @Get()
  async getCartItems(@Query('userId') userId: number) {
    if (!userId) {
      return { message: "Thiếu userId", items: [] }; // Trả về danh sách rỗng thay vì undefined
    }
    return this.cartService.getCartItems(userId);
  }
  

  @Post('add')
  async addToCart(@Req() req, @Body() body) {
    if (!req.session || !req.session.user) {
      return { message: 'Bạn chưa đăng nhập', statusCode: 403 };
    }

    const userId = req.session.user.id;
    const { productId, sizeId, quantity } = body;

    return this.cartService.addToCart(userId, productId, sizeId, quantity);
  }

  @Put('update')
  async updateQuantity(@Body() { userId, productId, sizeId, quantity }) {
    return this.cartService.updateQuantity(userId, productId, sizeId, quantity);
  }
  @Put('update-size')
  async updateSize(@Body() { userId, productId, oldSizeId, newSizeId }) {
    return this.cartService.updateSize(userId, productId, oldSizeId, newSizeId);
  }

  @Delete('remove')
  async removeFromCart(@Body() { userId, productId, sizeId }) {
    return this.cartService.removeFromCart(userId, productId, sizeId);
  }

  @Post('checkout')
  async checkout(@Body() { userId }) {
    return this.cartService.checkout(userId);
  }

}
