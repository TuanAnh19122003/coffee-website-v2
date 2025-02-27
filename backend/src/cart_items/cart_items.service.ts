import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCartItemDto } from './dto/create-cart_item.dto';
import { UpdateCartItemDto } from './dto/update-cart_item.dto';
import { CartItem } from 'src/database/entities/cart_item.entity';

@Injectable()
export class CartItemsService {
  constructor(
    @Inject('CARTITEM_REPOSITORY')
    private cartItemRepository: Repository<CartItem>,
  ) {}
  create(createCartItemDto: CreateCartItemDto) {
    return 'This action adds a new cartItem';
  }

  findAll() {
    return `This action returns all cartItems`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cartItem`;
  }

  update(id: number, updateCartItemDto: UpdateCartItemDto) {
    return `This action updates a #${id} cartItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} cartItem`;
  }
}
