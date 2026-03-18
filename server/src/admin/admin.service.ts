import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { getWechatConfig, validateWechatConfig } from '../config/wechat.config';

interface WechatLoginResponse {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class AdminService {
  private dataPath = path.join(__dirname, '../../data');

  constructor(private configService: ConfigService) {}

  // 读取产品数据
  private loadProducts(): any[] {
    try {
      const filePath = path.join(this.dataPath, 'products.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取产品数据失败:', error);
      return [];
    }
  }

  // 保存产品数据
  private saveProducts(products: any[]): void {
    try {
      const filePath = path.join(this.dataPath, 'products.json');
      fs.writeFileSync(filePath, JSON.stringify(products, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存产品数据失败:', error);
      throw new HttpException('保存数据失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 读取活动数据
  private loadActivities(): any[] {
    try {
      const filePath = path.join(this.dataPath, 'activities.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取活动数据失败:', error);
      return [];
    }
  }

  // 保存活动数据
  private saveActivities(activities: any[]): void {
    try {
      const filePath = path.join(this.dataPath, 'activities.json');
      fs.writeFileSync(filePath, JSON.stringify(activities, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存活动数据失败:', error);
      throw new HttpException('保存数据失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 读取订单数据
  private loadOrders(): any[] {
    try {
      const filePath = path.join(this.dataPath, 'orders.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取订单数据失败:', error);
      return [];
    }
  }

  // 保存订单数据
  private saveOrders(orders: any[]): void {
    try {
      const filePath = path.join(this.dataPath, 'orders.json');
      fs.writeFileSync(filePath, JSON.stringify(orders, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存订单数据失败:', error);
      throw new HttpException('保存数据失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 读取管理员白名单
  private loadAdminWhitelist(): { adminOpenids: string[] } {
    try {
      const filePath = path.join(this.dataPath, 'admin-whitelist.json');
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('读取管理员白名单失败:', error);
      return { adminOpenids: [] };
    }
  }

  // 验证 openid 是否在白名单中
  private isAdminOpenid(openid: string): boolean {
    const whitelist = this.loadAdminWhitelist();
    return whitelist.adminOpenids.includes(openid);
  }

  // 调用微信 API 获取 openid
  private async getWechatOpenid(code: string): Promise<string> {
    if (!validateWechatConfig(this.configService)) {
      throw new HttpException('微信配置未完成，请配置 AppID 和 AppSecret', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const wechatConfig = getWechatConfig(this.configService);
    const url = `https://api.weixin.qq.com/sns/jscode2session?appid=${wechatConfig.appId}&secret=${wechatConfig.appSecret}&js_code=${code}&grant_type=authorization_code`;

    try {
      const response = await axios.get<WechatLoginResponse>(url);
      const data = response.data;

      if (data.errcode) {
        console.error('微信登录失败:', data.errcode, data.errmsg);
        throw new HttpException(`微信登录失败: ${data.errmsg}`, HttpStatus.UNAUTHORIZED);
      }

      if (!data.openid) {
        throw new HttpException('获取 openid 失败', HttpStatus.UNAUTHORIZED);
      }

      return data.openid;
    } catch (error) {
      console.error('调用微信 API 失败:', error);
      throw new HttpException('微信登录失败，请重试', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 管理员登录（账号密码）
  async login(username: string, password: string) {
    if (username === 'admin' && password === 'admin123') {
      return {
        token: Date.now().toString(),
        user: { id: 1, username: 'admin', name: '管理员' },
      };
    }
    throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
  }

  // 管理员微信登录
  async wechatLogin(code: string) {
    // 获取 openid
    const openid = await this.getWechatOpenid(code);

    // 验证是否在管理员白名单中
    if (!this.isAdminOpenid(openid)) {
      throw new HttpException('您没有管理员权限，请联系管理员添加', HttpStatus.FORBIDDEN);
    }

    return {
      token: Date.now().toString(),
      openid: openid,
      user: { id: 1, openid, name: '管理员' },
    };
  }

  // 获取商品列表
  async getProducts() {
    return this.loadProducts();
  }

  // 添加商品
  async addProduct(productDto: any) {
    const products = this.loadProducts();
    const newProduct = {
      id: Date.now(),
      ...productDto,
      sales: 0,
      createdAt: new Date().toISOString(),
    };
    products.push(newProduct);
    this.saveProducts(products);
    return newProduct;
  }

  // 编辑商品
  async updateProduct(id: number, productDto: any) {
    const products = this.loadProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new HttpException('商品不存在', HttpStatus.NOT_FOUND);
    }
    products[index] = { ...products[index], ...productDto };
    this.saveProducts(products);
    return products[index];
  }

  // 删除商品
  async deleteProduct(id: number) {
    const products = this.loadProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new HttpException('商品不存在', HttpStatus.NOT_FOUND);
    }
    products.splice(index, 1);
    this.saveProducts(products);
  }

  // 获取订单列表
  async getOrders() {
    return this.loadOrders();
  }

  // 更新订单状态
  async updateOrderStatus(id: number, status: string) {
    const orders = this.loadOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) {
      throw new HttpException('订单不存在', HttpStatus.NOT_FOUND);
    }
    orders[index].status = status;
    this.saveOrders(orders);
    return orders[index];
  }

  // 获取活动列表
  async getActivities() {
    return this.loadActivities();
  }

  // 添加活动
  async addActivity(activityDto: any) {
    const activities = this.loadActivities();
    const newActivity = {
      id: Date.now(),
      ...activityDto,
      createdAt: new Date().toISOString(),
    };
    activities.push(newActivity);
    this.saveActivities(activities);
    return newActivity;
  }

  // 编辑活动
  async updateActivity(id: number, activityDto: any) {
    const activities = this.loadActivities();
    const index = activities.findIndex(a => a.id === id);
    if (index === -1) {
      throw new HttpException('活动不存在', HttpStatus.NOT_FOUND);
    }
    activities[index] = { ...activities[index], ...activityDto };
    this.saveActivities(activities);
    return activities[index];
  }

  // 删除活动
  async deleteActivity(id: number) {
    const activities = this.loadActivities();
    const index = activities.findIndex(a => a.id === id);
    if (index === -1) {
      throw new HttpException('活动不存在', HttpStatus.NOT_FOUND);
    }
    activities.splice(index, 1);
    this.saveActivities(activities);
  }
}
