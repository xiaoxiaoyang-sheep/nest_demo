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
} from '@nestjs/common';
import { UserService } from './user.service';
import { ConfigService } from '@nestjs/config';
import { User } from './user.entity';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { GetUserDto } from './dto/get-user.dto';
import { TypeormFilter } from 'src/filters/typeorm.filter';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateUserPipe } from './pipes/create-user.pipe';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../guards/admin.guard';
import { JwtGuard } from 'src/guards/jwt.guard';

@Controller('user')
@UseGuards(JwtGuard)
@UseFilters(new TypeormFilter())
export class UserController {
  // private logger = new Logger(UserController.name);

  constructor(
    private userService: UserService,
    private configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {
    this.logger.log('UserController init');
  }

  @Get()
  // 非常重要的知识点
  // 1、 装饰器的执行顺序，方法的装饰器如果有多个，则是从下往上执行
  // @UseGuards(AdminGuard)
  // @UseGuards(AuthGuard('jwt'))
  //  2、 如果使用UserGuard传递多个守卫，则从前往后执行，如果前面的Guard没有通过，则后面的Guard不会执行
  // @UseGuards(AuthGuard('jwt'), AdminGuard)
  @UseGuards(AdminGuard)
  getUsers(@Query() query: GetUserDto): any {
    // this.logger.log(`请求getUsers成功`);
    // this.logger.warn(`请求getUsers成功`);
    // this.logger.error(`请求getUsers成功`);
    return this.userService.findAll(query);
    // return this.userService.getUsers();
  }

  @Post()
  addUser(@Body(CreateUserPipe) dto: CreateUserDto): any {
    // todo 解析Body参数
    const user = dto as User;
    
    // return this.userService.addUser();
    return this.userService.create(user);
  }

  @Patch('/:id')
  updateUser(
    @Body() dto: any,
    @Param('id') id: number,
    @Headers('Authorization') headers: any,
  ): any {
    if (id === headers) {
      // todo
      // 权限1: 判断用户是否是自己
      // 权限2: 判断用户是否有更新用户的权限
      // 返回数据： 不能包含敏感的password等信息
      const user = dto as User;
      return this.userService.update(id, user);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number): any {
    // todo 传递参数id
    return this.userService.remove(id);
  }

  @Get('/profile')
  @UseGuards(AuthGuard('jwt'))
  getUserProfile(
    @Query('id', ParseIntPipe) id: any
    // 这里req中的user是通过AuthGuard('jwt')中的validate方法返回的
    // PassportMoudle来添加的
    // @Req() req
  ): any {
    console.log(typeof id);
    
    return this.userService.findProfile(id);
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
