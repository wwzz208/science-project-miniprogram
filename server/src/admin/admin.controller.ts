import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 管理员登录（账号密码）
  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const result = await this.adminService.login(loginDto.username, loginDto.password);
    return {
      code: 200,
      msg: '登录成功',
      data: result,
    };
  }

  // 管理员微信登录
  @Post('wechat-login')
  async wechatLogin(@Body() loginDto: { code: string }) {
    const result = await this.adminService.wechatLogin(loginDto.code);
    return {
      code: 200,
      msg: '登录成功',
      data: result,
    };
  }

  // 获取商品列表
  @Get('products')
  async getProducts() {
    const products = await this.adminService.getProducts();
    return {
      code: 200,
      msg: '获取成功',
      data: products,
    };
  }

  // 添加商品
  @Post('products')
  async addProduct(@Body() productDto: any) {
    const product = await this.adminService.addProduct(productDto);
    return {
      code: 200,
      msg: '添加成功',
      data: product,
    };
  }

  // 编辑商品
  @Put('products/:id')
  async updateProduct(@Param('id') id: string, @Body() productDto: any) {
    const product = await this.adminService.updateProduct(parseInt(id), productDto);
    return {
      code: 200,
      msg: '更新成功',
      data: product,
    };
  }

  // 删除商品
  @Delete('products/:id')
  async deleteProduct(@Param('id') id: string) {
    await this.adminService.deleteProduct(parseInt(id));
    return {
      code: 200,
      msg: '删除成功',
      data: null,
    };
  }

  // 获取订单列表
  @Get('orders')
  async getOrders() {
    const orders = await this.adminService.getOrders();
    return {
      code: 200,
      msg: '获取成功',
      data: orders,
    };
  }

  // 更新订单状态
  @Put('orders/:id/status')
  async updateOrderStatus(@Param('id') id: string, @Body() statusDto: { status: string }) {
    const order = await this.adminService.updateOrderStatus(parseInt(id), statusDto.status);
    return {
      code: 200,
      msg: '更新成功',
      data: order,
    };
  }

  // 获取活动列表
  @Get('activities')
  async getActivities() {
    const activities = await this.adminService.getActivities();
    return {
      code: 200,
      msg: '获取成功',
      data: activities,
    };
  }

  // 添加活动
  @Post('activities')
  async addActivity(@Body() activityDto: any) {
    const activity = await this.adminService.addActivity(activityDto);
    return {
      code: 200,
      msg: '添加成功',
      data: activity,
    };
  }

  // 编辑活动
  @Put('activities/:id')
  async updateActivity(@Param('id') id: string, @Body() activityDto: any) {
    const activity = await this.adminService.updateActivity(parseInt(id), activityDto);
    return {
      code: 200,
      msg: '更新成功',
      data: activity,
    };
  }

  // 删除活动
  @Delete('activities/:id')
  async deleteActivity(@Param('id') id: string) {
    await this.adminService.deleteActivity(parseInt(id));
    return {
      code: 200,
      msg: '删除成功',
      data: null,
    };
  }
}
