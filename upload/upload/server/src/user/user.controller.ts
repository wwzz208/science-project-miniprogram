import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    const result = await this.userService.login(loginDto.username, loginDto.password);
    return {
      code: 200,
      msg: '登录成功',
      data: result,
    };
  }

  @Post('wechat-login')
  async wechatLogin(@Body() loginDto: { code: string }) {
    const result = await this.userService.wechatLogin(loginDto.code);
    return {
      code: 200,
      msg: '登录成功',
      data: result,
    };
  }

  @Post('register')
  async register(@Body() registerDto: { username: string; password: string; phone?: string }) {
    const result = await this.userService.register(registerDto.username, registerDto.password, registerDto.phone);
    return {
      code: 200,
      msg: '注册成功',
      data: result,
    };
  }
}
