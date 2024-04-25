import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpException,
  Post,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { SigninUserDto } from './dto/signin-user.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@UseFilters(new TypeormFilter())
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signin')
  async signin(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    const token = await this.authService.signin(username, password);
    return {
        access_token: token
    }
  }

  @Post('/signup')
  // @UseInterceptors(SerializeInterceptor)
  signup(@Body() dto: SigninUserDto) {
    const { username, password } = dto;
    // if (!username || !password) {
    //   throw new HttpException('用户名或密码不能为空', 400);
    // }
    // // 检测格式
    // if (typeof username !== 'string' || typeof password !== 'string') {
    //   throw new HttpException('用户名或密码格式不正确', 400);
    // }
    // // 检验长度
    // if (
    //   !(typeof username === 'string' && username.length >= 6) ||
    //   !(typeof password === 'string' && password.length >= 6)
    // ) {
    //   throw new HttpException('用户名或密码长度不正确', 400);
    // }
    return this.authService.signup(username, password);
  }
}
