import {
  Body,
  Controller,
  HttpException,
  Post,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';

@Controller('auth')
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  signin(@Body() dto: any) {
    const { username, password } = dto;
    return this.authService.signin(username, password);
  }

  @Post('/signup')
  signup(@Body() dto: any) {
    const { username, password } = dto;
    if (!username || !password) {
      throw new HttpException('用户名或密码不能为空', 400);
    }
    // 检测格式
    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new HttpException('用户名或密码格式不正确', 400);
    }
    // 检验长度
    if (
      !(typeof username === 'string' && username.length >= 6) ||
      !(typeof password === 'string' && password.length >= 6)
    ) {
      throw new HttpException('用户名或密码长度不正确', 400);
    }
    return this.authService.signup(username, password);
  }
}
