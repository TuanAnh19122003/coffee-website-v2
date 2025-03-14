import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }
  
  @Put(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }

  //API Lấy Tổng Số Đơn Hàng
  @Get('/stats/total-orders')
  getTotalOrders() {
    return this.ordersService.getTotalOrders();
  }

  //Lấy Tổng Doanh Thu
  @Get('/stats/total-revenue')
  getTotalRevenue() {
    return this.ordersService.getTotalRevenue();
  }

  //Lấy Doanh Thu Theo Ngày
  @Get('/stats/daily-revenue')
  getDailyRevenue() {
    return this.ordersService.getTodayRevenue();
  }

  //API Lấy Doanh Thu Theo Tháng (Năm Hiện Tại)
  @Get('/stats/monthly-revenue')
  getMonthlyRevenue() {
    return this.ordersService.getMonthlyRevenue();
  }
}
