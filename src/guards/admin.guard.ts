import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AdminGuard implements CanActivate {
  // 常见错误：在使用AdminGuard未导入UserModule
  constructor(private userService: UserService) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    // 1、获取请求对象
    const req = context.switchToHttp().getRequest()
    // 2、获取请求中的用户信息进行逻辑上的判断 -> 角色判断
    const user = await this.userService.find(req.user.username) as User

    // 普通用户
    // 后面加入更多的逻辑
    if(user.roles.filter(o => o.id === 2).length > 0) {
      return true
    }
    return false;
  }
}
