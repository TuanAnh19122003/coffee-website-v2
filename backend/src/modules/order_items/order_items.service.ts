import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderItemDto } from './dto/create-order_item.dto';
import { UpdateOrderItemDto } from './dto/update-order_item.dto';
import { OrderItem } from 'src/database/entities/order_item.entity';
import { OrdersService } from '../orders/orders.service';
import { ProductsService } from '../products/products.service';
import { ProductSizesService } from '../product_sizes/product_sizes.service';

@Injectable()
export class OrderItemsService {
  constructor(
    @Inject('ORDER_ITEM_REPOSITORY')
    private orderItemRepository: Repository<OrderItem>,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private productSizesService: ProductSizesService,
  ){}

  async findAll() {
    const orderItems = await this.orderItemRepository.find({
      relations: ['order','product','size'],
    })
    return orderItems;
  }

  async create(createOrderItemDto: CreateOrderItemDto):Promise<OrderItem> {
    const orderItem = this.orderItemRepository.create(createOrderItemDto);
    if(createOrderItemDto.orderId){
      const order = await this.ordersService.findOne(createOrderItemDto.orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      orderItem.order = order;
    }
    if(createOrderItemDto.productId){
      const product = await this.productsService.findOne(createOrderItemDto.productId);
      if (!product) {
        throw new Error('Product not found');
      }
      orderItem.product = product;
    }
    if(createOrderItemDto.sizeId){
      const size = await this.productSizesService.findOne(createOrderItemDto.sizeId);
      if (!size) {
        throw new Error('Product size not found');
      }
      orderItem.size = size;
    }
    return await this.orderItemRepository.save(orderItem);
  }

  async findOne(id: number):Promise<OrderItem> {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: ['order','product','size'],
    });
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    return orderItem;
  }

  async update(id: number, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);
    if (!orderItem) {
      throw new Error('Order item not found');
    }
    if(updateOrderItemDto.orderId){
      const order = await this.ordersService.findOne(updateOrderItemDto.orderId);
      if (!order) {
        throw new Error('Order not found');
      }
      orderItem.order = order;
    }

    if(updateOrderItemDto.productId){
      const product = await this.productsService.findOne(updateOrderItemDto.productId);
      if (!product) {
        throw new Error('Product not found');
      }
      orderItem.product = product;
    }
    if(updateOrderItemDto.sizeId){
      const size = await this.productSizesService.findOne(updateOrderItemDto.sizeId);
      if (!size) {
        throw new Error('Product size not found');
      }
      orderItem.size = size;
    }
    await this.orderItemRepository.update(id, updateOrderItemDto);
    return {
     ...orderItem,
     ...updateOrderItemDto,
    };
  }

  async remove(id: number):Promise<void> {
    await this.orderItemRepository.delete(id);
  }
}
