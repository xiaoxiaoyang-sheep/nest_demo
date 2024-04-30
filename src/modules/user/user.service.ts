import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './user.entity';
import { Logs } from '../logs/logs.entity';
import { GetUserDto } from './dto/get-user.dto';
import { conditionUtil } from '../../utils/db.helper';
import { Roles } from '../roles/roles.entity';
import * as argon2 from 'argon2'
import { CurUserType } from '../../common/decorators/current_user.decorator';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Logs) private readonly logsRepository: Repository<Logs>,
    @InjectRepository(Roles) private readonly rolesRepository: Repository<Roles>,
  ) {}

  findAll(query: GetUserDto) {
    const { limit, page, username, role, gender } = query;
    const take = limit || 10;
    const skip = ((page || 1) - 1) * take;
    // return this.userRepository.find({
    //   select: {
    //     id: true,
    //     username: true,
    //     profile: {
    //       gender: true,
    //     },
    //   },
    //   relations: {
    //     profile: true,
    //     roles: true,
    //   },
    //   where: {
    //     username,
    //     profile: {
    //       gender,
    //     },
    //     roles: {
    //       id: role,
    //     },
    //   },
    //   take,
    //   skip,
    // });
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .leftJoinAndSelect('user.roles', 'roles');

    const newQuery = conditionUtil<User>(queryBuilder, {
      'user.username': username,
      'profile.gender': gender,
      'roles.id': role,
    });
    return newQuery.take(take).skip(skip).getMany();
  }

  find(username: string) {
    return this.userRepository.findOne({ where: { username }, relations: ['roles', 'roles.menus'] });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(user: Partial<User>) {

    if (!user.roles) {
      const role = await this.rolesRepository.findOne({
        where: {
          id: 2,
        },
      });
      user.roles = [role];
    }

    if (user.roles instanceof Array && typeof user.roles[0] === 'number') {
      // 查询所用用户角色
      user.roles = await this.rolesRepository.find({
        where: {
          id: In(user.roles),
        },
      });
    }
    const userTmp = this.userRepository.create(user);
    // 对用户密码进行argon2加密
    userTmp.password = await argon2.hash(userTmp.password)
    return this.userRepository.save(userTmp);
  }

  async update(id: number, user: Partial<User>) {
    const userTemp = await this.findOne(id);
    if(user.password) {
      user.password =await argon2.hash(user.password)
    }
    const newUser = this.userRepository.merge(userTemp, user);
    // 联合模型更新需要使用save或者queryBuilder
    return this.userRepository.save(newUser);

    // 下面的update方法只适合单模型更新，不适合有关系的模型更新
    // return this.userRepository.update(id, user);
  }

  async remove(id: number, curUser: CurUserType) {
    const user = await this.update(id , {
      username: curUser.username + '_' + new Date().getTime(),
      deletedBy: id
    });
    console.log(user);
    
    return this.userRepository.softRemove(user);
  }

  findProfile(id: number) {
    return this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
  }

  async findUserLogs(id: number) {
    const user = await this.findOne(id);
    return this.logsRepository.find({
      where: {
        user: user.logs,
      },
      // relations: {
      //   user: true,
      // },
    });
  }

  findLogsByGroup(id: number) {
    // SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result;
    // return this.logsRepository.query(
    //   'SELECT logs.result as rest, COUNT(logs.result) as count from logs, user WHERE user.id = logs.userId AND user.id = 2 GROUP BY logs.result',
    // );
    return (
      this.logsRepository
        .createQueryBuilder('logs')
        .select('logs.result', 'result')
        .addSelect('COUNT("logs.result")', 'count')
        .leftJoinAndSelect('logs.user', 'user')
        .where('user.id = :id', { id })
        .groupBy('logs.result')
        .orderBy('count', 'DESC')
        .addOrderBy('result', 'DESC')
        .offset(2)
        .limit(3)
        // .orderBy('result', 'DESC')
        .getRawMany()
    );
  }
}
