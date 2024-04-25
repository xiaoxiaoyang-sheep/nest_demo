import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwt: JwtService,
  ) {}

  async signin(username: string, password: string) {
    const user = await this.userService.find(username);

    if (!user) {
      throw new ForbiddenException('用户存在，请注册');
    }

    // 用户密码进行比对
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new ForbiddenException('用户名或密码错误');
    }

    return await this.jwt.signAsync({
      username: user.username,
      sub: user.id,
    });

    // if (user && user.password === password) {
    //   // 生成token
    //   return await this.jwt.signAsync(
    //     {
    //       username: user.username,
    //       sub: user.id,
    //     },
    //     // 局部设置 -> refresh token
    //     // {
    //     //     expiresIn: '1d'
    //     // },
    //   );
    // }
  }

  async signup(username: string, password: string) {
    const user = await this.userService.find(username)
    if(user) {
      throw new ForbiddenException('用户已存在')
    }

    const res = await this.userService.create({ username, password });
    return res;
  }
}
