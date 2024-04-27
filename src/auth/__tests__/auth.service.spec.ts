import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '../../user/user.entity';
import * as argon2 from 'argon2'
import { ForbiddenException } from '@nestjs/common';

describe('AuthService（登陆鉴权模块-服务）', () => {
  let service: AuthService;
  let userService: Partial<UserService>;
  let jwt: Partial<JwtService>;
  let userArr: User[]
  const mockUser =  {
    username: 'sheeppro2123',
    password: '123456'
  } as User

  beforeEach(async () => {
    userArr = []

    userService = {
      find: (username: string) => {
        const user = userArr.find(user => user.username === username)
        return Promise.resolve(user)
      },
      create: async (user: Partial<User>) => {
        const tempUser = new User()
        tempUser.id = Math.floor(Math.random() * 1000)
        tempUser.username = user.username
        tempUser.password = await argon2.hash(user.password)
        userArr.push(tempUser)
        return Promise.resolve(tempUser)
      }
    }

    jwt = {
      // @ts-ignore
      signAsync: (payload: string, options?: any) => {
        return Promise.resolve('token')
      }
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: userService
        },
        {
          provide: JwtService,
          useValue: jwt
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    userArr = []
  })

  it('初始化，实例化', () => {
    expect(service).toBeDefined();
  });

  it('用户初次注册', async () => {
    const user = await service.signup(mockUser.username, mockUser.password)

    expect(user).toBeDefined()
    expect(user.username).toBe(mockUser.username)
  })

  it('用户使用相同的用户名再次注册', async () => {
    await service.signup(mockUser.username, mockUser.password)

    await expect(service.signup(mockUser.username, mockUser.password)).rejects.toThrowError()

    await expect(service.signup(mockUser.username, mockUser.password)).rejects.toThrow(new ForbiddenException('用户已存在'))
  })

  it('用户登陆', async () => {
    // 注册新用户
    await service.signup(mockUser.username, mockUser.password)

    // 登陆
    expect(await service.signin(mockUser.username, mockUser.password)).toBe('token')
  })

  it('用户登陆，用户名密码错误', async () => {
    // 注册新用户
    await service.signup(mockUser.username, mockUser.password)
     // 登陆
    expect(service.signin(mockUser.username, '12223123')).rejects.toThrowError()
    expect(service.signin(mockUser.username, '12223123')).rejects.toThrow(new ForbiddenException('用户名或密码错误'))

  })

  it('用户登陆，用户名不存在', async () => {
    expect(service.signin(mockUser.username, mockUser.password)).rejects.toThrowError()
    expect(service.signin(mockUser.username, mockUser.password)).rejects.toThrow(new ForbiddenException('用户未存在，请注册'))
  })
});
