import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from 'src/database/entities/cart.entity';
import { CartItem } from 'src/database/entities/cart_item.entity';
import { ProductSize } from 'src/database/entities/product_size.entity';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_REPOSITORY')
    private readonly cartRepository: Repository<Cart>,
    @Inject('CART_ITEM_REPOSITORY')
    private readonly cartItemRepository: Repository<CartItem>,
    @Inject('PRODUCT_SIZE_REPOSITORY')
    private readonly productSizeRepository: Repository<ProductSize>,
  ) {}

  async addToCart(userId: number, productId: number, sizeId: number, quantity: number) {
    console.log(`📩 Nhận request - UserID: ${userId}, ProductID: ${productId}, SizeID: ${sizeId}, Quantity: ${quantity}`);
  
    // Kiểm tra kiểu dữ liệu
    if (typeof productId !== 'number' || typeof sizeId !== 'number') {
      console.error('❌ Lỗi: productId hoặc sizeId không phải là số!', { productId, sizeId });
      throw new Error('Dữ liệu productId hoặc sizeId không hợp lệ!');
    }
  
    // Kiểm tra giỏ hàng của user
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems', 'cartItems.size', 'cartItems.product'],
    });
  
    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
      console.log('🆕 Tạo giỏ hàng mới:', cart);
    }
  
    // Kiểm tra ProductSize trong DB
    const productSize = await this.productSizeRepository.findOne({
      where: { id: sizeId },
      relations: ['product', 'product.specials', 'product.specials.special'],
    });
  
    if (!productSize) {
      console.error(`❌ Không tìm thấy Size ID: ${sizeId} cho Product ID: ${productId}`);
      throw new NotFoundException(`Size không hợp lệ cho sản phẩm ID: ${productId}`);
    }
  
    console.log('✅ Product Size tìm thấy:', productSize);
  
    let price = productSize.price;
    const now = new Date();
    const activeSpecial = productSize.product.specials.find(ps =>
      ps.special.start_date <= now && ps.special.end_date >= now
    );
  
    if (activeSpecial) {
      price -= price * (activeSpecial.special.discount_percentage / 100);
    }
  
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingCartItem = await this.cartItemRepository.findOne({
      where: {
        cart: { id: cart.id },
        product: { id: productId },
        size: { id: productSize.id }
      }
    });
  
    console.log('🔎 Kiểm tra sản phẩm đã có trong giỏ hàng:', existingCartItem);
  
    if (existingCartItem) {
      existingCartItem.quantity += quantity;
      existingCartItem.price = price;
      console.log('🔄 Cập nhật Cart Item:', existingCartItem);
      return this.cartItemRepository.save(existingCartItem);
    }
  
    const cartItem = this.cartItemRepository.create({
      cart,
      product: productSize.product,
      size: productSize,
      quantity,
      price,
    });
  
    console.log('🆕 Thêm mới Cart Item:', cartItem);
    return this.cartItemRepository.save(cartItem);
  }
  
  
  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartItems', 'cartItems.product', 'cartItems.size'],
    });

    if (!cart) {
      throw new NotFoundException('Giỏ hàng không tồn tại');
    }
    
    return cart;
  }
}
