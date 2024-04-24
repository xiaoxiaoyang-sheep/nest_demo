import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwt: JwtService,
  ) {}

  async signin(username: string, password: string) {
    const user = await this.userService.find(username);

    if (user && user.password === password) {
      // 生成token
      return await this.jwt.signAsync(
        {
          username: user.username,
          sub: user.id,
        },
        // 局部设置 -> refresh token
        // {
        //     expiresIn: '1d'
        // },
      );
    }
    throw new UnauthorizedException();
  }

  async signup(username: string, password: string) {
    const res = await this.userService.create({ username, password });
    return res;
  }
}
