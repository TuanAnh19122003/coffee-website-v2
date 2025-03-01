import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
    private usersService: UsersService,
  ) {}
  
  async findAll() {
    const order = await this.orderRepository.find({
      relations: ['user']
    })
    return order;
  }
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    if(createOrderDto.userId){
      const user = await this.usersService.findOne(createOrderDto.userId);
      if(!user){
        throw new Error('User not found')
      }
      order.user = user;
    }
    return await this.orderRepository.save(order);
  }

  async findOne(id: number):Promise<Order | null> {
    const order = this.orderRepository.findOne({
      where: { id },
      relations: ['user']
    })
    if(!order){
      throw new Error('Order not found')
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if(!order){
      throw new Error('Order not found')
    }
    await this.orderRepository.update(id, updateOrderDto);
    return {...order,...updateOrderDto};
  }

  async remove(id: number):Promise<void> {
    await this.orderRepository.delete(id);
  }
}
