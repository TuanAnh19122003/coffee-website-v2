import { Injectable, Inject } from '@nestjs/common';
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
  ) { }

  async addToCart(userId: number, productId: number, sizeId: number, quantity: number) {
    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId } },
      relations: ['cartItems'],
    });

    // Nếu giỏ hàng chưa tồn tại, tạo mới giỏ hàng
    if (!cart) {
      cart = this.cartRepository.create({ user: { id: userId } });
      await this.cartRepository.save(cart);
    }

    // Lấy thông tin sản phẩm theo size đã chọn
    const productSize = await this.productSizeRepository.findOne({
      where: { id: sizeId },
      relations: ['product', 'product.specials', 'product.specials.special'],
    });

    if (!productSize) {
      throw new Error(`Size không hợp lệ cho sản phẩm ID: ${productId}`);
    }

    let price = productSize.price;
    const now = new Date();

    // Áp dụng giảm giá nếu có
    const activeSpecial = productSize.product.specials.find(ps =>
      ps.special.start_date <= now && ps.special.end_date >= now
    );

    if (activeSpecial) {
      price -= price * (activeSpecial.special.discount_percentage / 100);
    }

    // Kiểm tra nếu sản phẩm đã có trong giỏ hàng
    const existingCartItem = cart.cartItems?.find(
      (item) => item?.product?.id === productId && item?.size?.id === sizeId
    );

    if (existingCartItem) {
      // Nếu sản phẩm đã có trong giỏ, chỉ cần tăng số lượng lên
      existingCartItem.quantity += quantity;
      await this.cartItemRepository.save(existingCartItem);
      return existingCartItem;
    }

    // Nếu sản phẩm chưa có trong giỏ, tạo mới item trong giỏ
    const cartItem = this.cartItemRepository.create({
      cart,
      product: productSize.product,
      size: productSize,
      quantity,
      price,
    });

    return this.cartItemRepository.save(cartItem);
  }

  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['cartItems', 'cartItems.product', 'cartItems.size'],
    });
    if (!cart) {
      throw new Error('Giỏ hàng không tồn tại');
    }
    return cart;
  }
}
