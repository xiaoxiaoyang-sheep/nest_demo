import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { User } from '../user.entity';
import { GetUserDto } from '../dto/get-user.dto';
import { Logs } from '../../logs/logs.entity';
import { Roles } from '../../roles/roles.entity';



describe('UserController(用户模块-控制器)', () => {
  let controller: UserController;
  let userService: Partial<UserService>

  beforeEach(async () => {
    userService = {
      create: (user: Partial<User>) => {
        return Promise.resolve({} as User)
      },
      findAll: (query: GetUserDto) => {
        const user = new User()
        user.username = "test",
        user.id = 1
        user.roles = [{ id: 1, name: "管理员"}] as Roles[]
        return Promise.resolve([user])
      },
      update: (id: number, user: Partial<User>) => {
        return Promise.resolve({} as User)
      },
      remove: (id: number) => {
        return Promise.resolve({} as User)
      },
      findProfile: (id: number) => {
        return Promise.resolve({} as User)
      },
      findUserLogs: (id: number) => {
        return Promise.resolve([] as Logs[])
      },
      findLogsByGroup: (id: number) => {
        return Promise.resolve([] as any[])
      }
    }



    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: userService,
        }
      ]
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('初始化-实例化', () => {
    expect(controller).toBeDefined();
  });

  it('获取全部用户', async () => {
    const res = await controller.getUsers({page: 1})
    expect(res instanceof Array).toBeTruthy()
    expect(res[0].username).toBe('test')
  })
});
