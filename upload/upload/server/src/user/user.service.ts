import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';
import { getWechatConfig, validateWechatConfig } from '../config/wechat.config';

interface User {
  id: number;
  username: string;
  password: string;
  nickname: string;
  phone?: string;
  openid?: string;
  points: number;
  level: number;
}

interface WechatLoginResponse {
  openid: string;
  session_key: string;
  unionid?: string;
  errcode?: number;
  errmsg?: string;
}

@Injectable()
export class UserService {
  private users: User[] = [];
  private dataFilePath = path.join(process.cwd(), 'data', 'users.json');

  constructor(private configService: ConfigService) {
    this.loadUsers();
  }

  private loadUsers() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }

      if (fs.existsSync(this.dataFilePath)) {
        const data = fs.readFileSync(this.dataFilePath, 'utf-8');
        this.users = JSON.parse(data);
      } else {
        // 初始化默认用户
        this.users = [
          { id: 1, username: 'test', password: '123456', nickname: '测试用户', points: 1280, level: 3 },
        ];
        this.saveUsers();
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
      this.users = [
        { id: 1, username: 'test', password: '123456', nickname: '测试用户', points: 1280, level: 3 },
      ];
    }
  }

  private saveUsers() {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(this.dataFilePath, JSON.stringify(this.users, null, 2), 'utf-8');
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  }

  async login(username: string, password: string) {
    const user = this.users.find(u => u.username === username && u.password === password);
    if (user) {
      return {
        token: Date.now().toString(),
        user: {
          id: user.id,
          username: user.username,
          nickname: user.nickname,
          points: user.points,
          level: user.level,
        },
      };
    }
    throw new HttpException('用户名或密码错误', HttpStatus.UNAUTHORIZED);
  }

  async register(username: string, password: string, phone?: string) {
    const existingUser = this.users.find(u => u.username === username);
    if (existingUser) {
      throw new HttpException('用户名已存在', HttpStatus.BAD_REQUEST);
    }

    const newUser: User = {
      id: Date.now(),
      username,
      password,
      nickname: username,
      phone,
      points: 0,
      level: 1,
    };

    this.users.push(newUser);
    this.saveUsers();

    return {
      token: Date.now().toString(),
      user: {
        id: newUser.id,
        username: newUser.username,
        nickname: newUser.nickname,
        points: newUser.points,
        level: newUser.level,
      },
    };
  }

  async getUserById(id: number) {
    const user = this.users.find(u => u.id === id);
    if (user) {
      return {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        points: user.points,
        level: user.level,
      };
    }
    throw new HttpException('用户不存在', HttpStatus.NOT_FOUND);
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

  // 微信授权登录
  async wechatLogin(code: string) {
    // 获取 openid
    const openid = await this.getWechatOpenid(code);

    // 打印 openid（方便管理员添加到白名单）
    console.log('=== 微信用户 openid ===');
    console.log(openid);
    console.log('===================');

    // 查找是否已存在该用户
    let user = this.users.find(u => u.openid === openid);

    if (!user) {
      // 首次登录，自动创建用户
      user = {
        id: Date.now(),
        username: `wx_${openid.substring(0, 10)}`,
        password: '', // 微信登录无需密码
        nickname: `微信用户${Math.floor(Math.random() * 10000)}`,
        openid: openid,
        points: 0,
        level: 1,
      };

      this.users.push(user);
      this.saveUsers();
    }

    return {
      token: Date.now().toString(),
      user: {
        id: user.id,
        username: user.username,
        nickname: user.nickname,
        points: user.points,
        level: user.level,
        openid: user.openid,
      },
    };
  }
}
