import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from 'src/database/entities/order.entity';
import { UsersService } from '../users/users.service';
import * as paypal from 'paypal-rest-sdk';
import { paypalConfig } from 'src/config/paypal.config';
import { OrderItem } from 'src/database/entities/order_item.entity';
import { ProductsService } from '../products/products.service';
import { ProductSizesService } from '../product_sizes/product_sizes.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('ORDER_REPOSITORY')
    private orderRepository: Repository<Order>,
    @Inject('ORDER_ITEM_REPOSITORY')
    private readonly orderItemRepository: Repository<OrderItem>,
    private usersService: UsersService,
    private productsService: ProductsService,
    private productSizesService: ProductSizesService,
  ) {
    paypal.configure(paypalConfig);
  }

  async findAll() {
    const order = await this.orderRepository.find({
      relations: ['user', 'orderItems', 'orderItems.product']
    })
    return order;
  }
  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const order = this.orderRepository.create(createOrderDto);
    if (createOrderDto.userId) {
      const user = await this.usersService.findOne(createOrderDto.userId);
      if (!user) {
        throw new Error('User not found')
      }
      order.user = user;
    }
    return await this.orderRepository.save(order);
  }

  async findOne(id: number): Promise<Order | null> {
    const order = this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'orderItems', 'orderItems.product']
    })
    if (!order) {
      throw new Error('Order not found')
    }
    return order;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new Error('Order not found')
    }
    await this.orderRepository.update(id, updateOrderDto);
    return { ...order, ...updateOrderDto };
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }
  // Thống kê tổng số đơn hàng
  async getTotalOrders(): Promise<number> {
    return await this.orderRepository.count();
  }

  // Thống kê tổng doanh thu
  async getTotalRevenue(): Promise<number> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select('SUM(order.total_price)', 'totalRevenue')
      .where('order.status = :status', { status: 'Completed' })
      .andWhere('YEAR(order.order_date) = YEAR(CURDATE())')
      .getRawOne();

    return parseFloat(result.totalRevenue) || 0;
  }


  // Thống kê doanh thu theo ngày
  async getTodayRevenue(): Promise<{ revenue: number }> {
    const result = await this.orderRepository
      .createQueryBuilder('order')
      .select("COALESCE(SUM(order.total_price), 0) AS revenue")
      .where("DATE(order.order_date) = CURRENT_DATE")
      .getRawOne();

    return result ?? { revenue: 0 };
  }


  // Thống kê doanh thu theo tháng trong năm hiện tại
  async getMonthlyRevenue(): Promise<{ month: string; revenue: number }[]> {
    return await this.orderRepository
      .createQueryBuilder('order')
      .select("DATE_FORMAT(order.order_date, '%Y-%m') AS month")
      .addSelect("SUM(order.total_price) AS revenue")
      .where("YEAR(order.order_date) = YEAR(CURDATE())")
      .andWhere("MONTH(order.order_date) = MONTH(CURDATE())")
      .groupBy("month")
      .getRawMany();
  }


  // Thống kê doanh thu từng ngày trong tháng hiện tại
  async getDailyRevenueInMonth(month: number): Promise<{ day: number; revenue: number }[]> {
    const rawData = await this.orderRepository
      .createQueryBuilder('order')
      .select("DAY(order.order_date) AS day")
      .addSelect("SUM(order.total_price) AS revenue")
      .where("MONTH(order.order_date) = :month", { month })
      .andWhere("YEAR(order.order_date) = YEAR(CURDATE())")
      .groupBy("day")
      .orderBy("day", "ASC")
      .getRawMany();

    return rawData.map((item) => ({
      day: item.day,
      revenue: parseFloat(item.revenue) || 0
    }));
  }

  async createPayment(createOrderDto: CreateOrderDto): Promise<any> {
    console.log("Received order data for PayPal:", createOrderDto);

    if (!createOrderDto.total_price || createOrderDto.total_price <= 0) {
      throw new Error('Invalid total price: Amount must be greater than zero');
    }

    // Tạo đơn hàng
    const order = this.orderRepository.create({
      ...createOrderDto,
      paymentMethod: 'paypal',
    });

    if (createOrderDto.userId) {
      const user = await this.usersService.findOne(createOrderDto.userId);
      if (!user) {
        throw new Error('User not found');
      }
      order.user = user;
    }

    const savedOrder = await this.orderRepository.save(order);

    // Lưu các mục orderItems và đảm bảo productId và sizeId được truyền vào
    if (createOrderDto.orderItems && createOrderDto.orderItems.length > 0) {
      order.orderItems = createOrderDto.orderItems.map((item) => {
        // Không cần phải tìm lại sản phẩm và kích thước từ DB, trực tiếp lấy từ item
        return {
          ...item,
          order: savedOrder,
          productId: item.product, // Giữ nguyên productId từ frontend
          sizeId: item.size, // Giữ nguyên sizeId từ frontend
          price: item.price, // Giữ nguyên price từ frontend
          quantity: item.quantity, // Giữ nguyên quantity từ frontend
        };
      });

      // Lưu các orderItems vào cơ sở dữ liệu
      await this.orderItemRepository.save(order.orderItems);
    }

    const totalPrice = Number(savedOrder.total_price);
    if (isNaN(totalPrice) || totalPrice <= 0) {
      throw new Error('Invalid total price: Must be a valid number greater than zero');
    }

    const paymentData = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      redirect_urls: {
        return_url: 'http://localhost:5000/orders/paypal-success',
        cancel_url: 'http://localhost:5000/orders/paypal-cancel',
      },
      transactions: [
        {
          amount: {
            total: totalPrice.toFixed(2),
            currency: 'USD',
          },
          description: `Order #${savedOrder.id}`,
        },
      ],
    };

    return new Promise((resolve, reject) => {
      paypal.payment.create(paymentData, async (error, payment) => {
        if (error) {
          console.error("PayPal Error:", error);
          reject(error);
        } else {
          savedOrder.paymentId = payment.id;
          await this.orderRepository.save(savedOrder);
          const approvalUrl = payment.links.find(link => link.rel === 'approval_url')?.href;
          resolve({ approvalUrl });
        }
      });
    });
  }

}
