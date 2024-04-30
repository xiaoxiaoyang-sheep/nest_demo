import { pactumType } from "./setup-jest";

describe('Auth登陆认证  e2e测试', () => {
  let pactum: pactumType;

  beforeEach(() => {
    pactum = global.pactum;
  });

  // 注册用户
  it('注册用户', () => {
    const user = {
      username: 'sheep123',
      password: '123456',
    };

    return pactum.spec()
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(201)
      .expectBodyContains(user.username)
      .expectJsonLike({
        code: 200,
        data: {
            id: 25,
            username: user.username
        }
      });
  });
  // 注册新用户
  // 重复注册用户
  it('重复注册用户', async () => {
    const user = {
      username: 'sheep123',
      password: '123456',
    };
    await pactum.spec().post('/api/v1/auth/signup').withBody(user)
    return pactum.spec()
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(403)
      .expectBodyContains('用户已存在')
      
  });
  // 注册用户传参异常 username password -> 长度 类型 空
  it('注册用户传参异常 username', async () => {
    const user = {
      username: 'sheep',
      password: '123456',
    };
    return pactum.spec()
      .post('/api/v1/auth/signup')
      .withBody(user)
      .expectStatus(400)
      .expectBodyContains('用户名长度必须在')
      
  });
  // 登陆用户
  it('登陆用户', async () => {
    const user = {
      username: 'sheep123',
      password: '123456',
    };
    await pactum.spec().post('/api/v1/auth/signup').withBody(user)
    return pactum.spec()
      .post('/api/v1/auth/signin')
      .withBody(user)
      .expectStatus(201)
      .expectBodyContains('access_token')
  
      
  });

  // 登陆用户传参异常 username password -> 长度 类型 空
  it('登陆用户传参异常', async () => {
    const user = {
      username: 'sheep123',
      password: '123456',
    };
    await pactum.spec().post('/api/v1/auth/signup').withBody(user)
    return pactum.spec()
      .post('/api/v1/auth/signin')
      .withBody({username: 'sheep', password: '123456'})
      .expectStatus(400)
      .expectBodyContains('用户名长度必须在')
  
      
  });

  // 登陆用户不存在
  it('登陆用户不存在', async () => {
    const user = {
      username: 'sheep123',
      password: '123456',
    };
    await pactum.spec().post('/api/v1/auth/signup').withBody(user)
    return pactum.spec()
      .post('/api/v1/auth/signin')
      .withBody({username: 'sheep1233', password: '123456'})
      .expectStatus(403)
      .expectBodyContains('用户未存在')
  
      
  });
  
  // 登陆用户账号或密码错误
  it('登陆用户账号或密码错误', async () => {
    const user = {
      username: 'sheep123',
      password: '123456',
    };
    await pactum.spec().post('/api/v1/auth/signup').withBody(user)
    return pactum.spec()
      .post('/api/v1/auth/signin')
      .withBody({username: 'sheep123', password: '1234567'})
      .expectStatus(403)
      .expectBodyContains('用户名或密码错误')
  
      
  });
  // 补充说明
  // user模块 -> headers -> token信息 -> beforeEach -> 获取token
});
