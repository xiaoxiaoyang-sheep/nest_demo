import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserService } from '../user/user.service';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(private reflector: Reflector, private userService: UserService) {}
 
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean>  {
    // getAllAndMerge 路由上的和控制器上的合并
    // getAllAndOverride 路由上的覆盖控制器上的
    const requiredRoles = this.reflector.getAllAndMerge(ROLES_KEY, [
      context.getHandler(), // 从路由上获取
      context.getClass(), // 从控制器上获取
    ])

    if(!requiredRoles) return true

    const req = context.switchToHttp().getRequest()

    const user = await this.userService.find(req.user.username)

    const roleIds = user.roles.map(o => o.id)
    const flag = requiredRoles.some(role => roleIds.includes(role))

    return flag;
  }
}
