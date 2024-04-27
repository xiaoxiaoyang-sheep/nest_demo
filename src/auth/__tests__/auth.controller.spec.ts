import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { User } from '../../user/user.entity';
import { SigninUserDto } from '../dto/signin-user.dto';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { Roles } from '../../roles/roles.entity';

describe('AuthController（登陆鉴权模块-控制器）', () => {
  let controller: AuthController;
  let mockAuthService: Partial<AuthService>;

  beforeEach(async () => {
    // 模拟的AuthService -> 与后续的依赖项UserService等无关联的依赖项
    mockAuthService = {
      signin: (username: string, password: string) => {
        return Promise.resolve('token')
      },
      signup: (username: string, password: string) => {
        const user = new User()
        user.id = 1
        user.username = 'test'
        user.roles = [{id: 2, name: '普通用户'}] as Roles[]
        return Promise.resolve(user)
      },
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{
        provide: AuthService,
        useValue: mockAuthService
      }]
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('鉴权-初始化-实例化', () => {
    expect(controller).toBeDefined();
  });

  it('鉴权-控制器-signin登陆', async () => {
    const res = controller.signin({
      username: 'test',
      password: '123456'
    } as SigninUserDto)
    expect(await res).not.toBe(null)
    expect((await res).access_token).toBe('token')
  })

  it('鉴权-控制器-signup注册', async () => {
    const res = controller.signup({
      username: 'test',
      password: '123456'
    } as CreateUserDto)

    expect(await res).not.toBeNull()
    expect((await res).id).not.toBeNull()
    expect((await res).password).toBeUndefined()
    expect((await res) instanceof User).toBeTruthy()
    expect((await res).username).toBe('test')
    expect((await res).roles.length).toBeGreaterThan(0)

  })
});
