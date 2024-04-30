import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Inject,
  LoggerService,
  Body,
  Query,
  Param,
  UseFilters,
  Headers,
  UnauthorizedException,
  UseGuards,
  Req,
  ParseIntPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonLogger } from 'nest-winston';
import { GetUserDto } from './dto/get-user.dto';
import { TypeormFilter } from '../../common/filters/typeorm.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../common/guards/admin.guard';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { CurUser, CurUserType } from '../../common/decorators/current_user.decorator';
import { SerializeInterceptor } from '../../common/interceptors/serialize.interceptor';

@Controller('user')
@UseGuards(JwtGuard)
@UseFilters(new TypeormFilter())
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    // this.logger.log('UserController init');
  }

  @Get()
  // 非常重要的知识点
  // 1、 装饰器的执行顺序，方法的装饰器如果有多个，则是从下往上执行
  // @UseGuards(AdminGuard)
  // @UseGuards(AuthGuard('jwt'))
  //  2、 如果使用UserGuard传递多个守卫，则从前往后执行，如果前面的Guard没有通过，则后面的Guard不会执行
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseGuards(AdminGuard)
  async getUsers(@Query() query: GetUserDto): Promise<any> {
    // this.logger.log(`请求getUsers成功`);
    // this.logger.warn(`请求getUsers成功`);
    // this.logger.error(`请求getUsers成功`);
    const data = await this.userService.findAll(query);
    return {data}
    // return this.userService.getUsers();
  }

  @Post()
  async addUser(@Body(CreateUserPipe) dto: CreateUserDto): Promise<any> {
    // todo 解析Body参数
    const user = dto as User;
    
    // return this.userService.addUser();
    const data = await this.userService.create(user);
    return {data}
  }

  @Patch('/:id')
  @UseInterceptors(new SerializeInterceptor(User))
  async updateUser(
    @CurUser() curUser: CurUserType,
    @Body() dto: any,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<any> {
    if (curUser.userId === id) {
      // todo
      // 权限1: 判断用户是否是自己
      // 权限2: 判断用户是否有更新用户的权限
      // 返回数据： 不能包含敏感的password等信息
      const user = dto as User;
      const data = await this.userService.update(id, {
        ...user,
        updatedBy: curUser.userId
 
      });
      return {
        data
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  @UseInterceptors(new SerializeInterceptor(User))
  async deleteUser(
    @CurUser() curUser: CurUserType,
    @Param('id') id: number): Promise<any> {
    // todo 传递参数id
    const data = await this.userService.remove(id, curUser);
    return {data}
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  getUserProfile(
    @Query('id', ParseIntPipe) id: any
    // 这里req中的user是通过AuthGuard('jwt')中的validate方法返回的
    // PassportMoudle来添加的
    // @Req() req
  ): any {

    return this.userService.findProfile(id,);
  }

  @Get('/logs')
  getUserLogs(): any {
    return this.userService.findUserLogs(2);
  }

  @Get('/logsByGroup')
  async getLogsByGroup(): Promise<any> {
    const res = await this.userService.findLogsByGroup(2);
    // return res.map((o) => ({
    //   result: o.result,
    //   count: o.count,
    // }));
    return res;
  }

  @Get('/:id')
  getUser(): any {
    return 'hello world';
  }
}
