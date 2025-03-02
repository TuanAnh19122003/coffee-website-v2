import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { CartItem } from 'src/database/entities/cart_item.entity';
import { CartService } from '../cart/cart.service';
import { ProductSizesService } from '../product_sizes/product_sizes.service';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CartItemsService {
  constructor(
    @Inject('CARTITEM_REPOSITORY')
    private cartItemRepository: Repository<CartItem>,
    private productService: ProductsService,
    private productSizeService: ProductSizesService,
    private cartService: CartService
  ) { }

  async findAll() {
    const cartItem = await this.cartItemRepository.find({
      relations: ['product', 'size', 'cart']
    })
    return cartItem;
  }

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    // Kiểm tra giỏ hàng tồn tại
    const cart = await this.cartService.findOne(createCartItemDto.cartId);
    if (!cart) {
      throw new Error(`Cart with ID ${createCartItemDto.cartId} not found`);
    }

    // Kiểm tra sản phẩm tồn tại
    const product = await this.productService.findOne(createCartItemDto.productId);
    if (!product) {
      throw new Error(`Product with ID ${createCartItemDto.productId} not found`);
    }

    // Kiểm tra kích thước sản phẩm tồn tại
    const size = await this.productSizeService.findOne(createCartItemDto.sizeId);
    if (!size) {
      throw new Error(`Size with ID ${createCartItemDto.sizeId} not found`);
    }

    // Tạo cart item mới với đầy đủ quan hệ
    const cartItem = this.cartItemRepository.create({
      cart,
      product,
      size,
      quantity: createCartItemDto.quantity,
      price: createCartItemDto.price
    });

    return this.cartItemRepository.save(cartItem);
  }



  async findOne(id: number): Promise<CartItem | null> {
    const cartItem = this.cartItemRepository.findOne({
      where: { id },
      relations: ['product', 'size', 'cart']
    })
    if (!cartItem) {
      throw new Error(`Cart with ID $${id} not found`);
    }
    return cartItem
  }

  async update(id: number, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    const cartItem = await this.findOne(id);
    if (!cartItem) {
      throw new Error(`CartItem with ID ${id} not found`);
    }

    if (updateCartItemDto.cartId) {
      const cart = await this.cartService.findOne(updateCartItemDto.cartId);
      if (!cart) {
        throw new Error(`Product with ID ${updateCartItemDto.productId} not found`);
      }
      cartItem.cart = cart;
    }

    // Kiểm tra nếu có cập nhật sản phẩm
    if (updateCartItemDto.productId) {
      const product = await this.productService.findOne(updateCartItemDto.productId);
      if (!product) {
        throw new Error(`Product with ID ${updateCartItemDto.productId} not found`);
      }
      cartItem.product = product;
    }

    // Kiểm tra nếu có cập nhật kích thước sản phẩm
    if (updateCartItemDto.sizeId) {
      const size = await this.productSizeService.findOne(updateCartItemDto.sizeId);
      if (!size) {
        throw new Error(`Size with ID ${updateCartItemDto.sizeId} not found`);
      }
      cartItem.size = size;
    }

    // Cập nhật các trường còn lại
    Object.assign(cartItem, updateCartItemDto);

    return this.cartItemRepository.save(cartItem);
  }

  async remove(id: number): Promise<string> {
    const cartItem = await this.findOne(id);
    if (!cartItem) {
      throw new Error(`CartItem with ID ${id} not found`);
    }

    await this.cartItemRepository.remove(cartItem);
    return `CartItem with ID ${id} has been removed`;
  }

}
