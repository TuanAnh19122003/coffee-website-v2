import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { Cart } from 'src/database/entities/cart.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class CartService {
  constructor(
    @Inject('CART_REPOSITORY')
    private cartRepository: Repository<Cart>,
    private usersService: UsersService,
  ) { }

  async findAll() {
    const cart = await this.cartRepository.find({
      relations: ['user']
    })
    return cart;
  }
  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const user = await this.usersService.findOne(createCartDto.userId);
    if (!user) {
      throw new Error('User not found');
    }
    const cart = this.cartRepository.create({ user });
    return this.cartRepository.save(cart);
  }


  async findOne(id: number): Promise<Cart> {
    const cart = await this.cartRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart;
  }

  async update(id: number, updateCartDto: UpdateCartDto): Promise<Cart> {
    const cart = await this.findOne(id);
    if (!cart) {
      throw new Error('Cart not found');
    }

    // Kiểm tra nếu có userId mới, tìm User trước khi cập nhật
    if (updateCartDto.userId) {
      const user = await this.usersService.findOne(updateCartDto.userId);
      if (!user) {
        throw new Error(`User with ID ${updateCartDto.userId} not found`);
      }
      cart.user = user;
    }

    // Cập nhật các giá trị khác (nếu có)
    Object.assign(cart, updateCartDto);

    return this.cartRepository.save(cart);
  }


  async remove(id: number): Promise<string> {
    const cart = await this.findOne(id);
    if (!cart) {
      throw new Error('Cart not found');
    }
    await this.cartRepository.remove(cart);
    return `Cart #${id} has been removed successfully`;
  }

}
