import { Global, Logger, Module } from '@nestjs/common';

import * as dotenv from 'dotenv';
import * as Joi from 'joi';


import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { LogsModule } from './logs/logs.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import { MenusModule } from './menus/menus.module';

import { connectionParams } from '../ormconfig';


const envFilePath = `.env.${process.env.NODE_ENV || `development`}`;

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      load: [() => dotenv.config({ path: '.env' })],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production')
          .default('development'),
        DB_PORT: Joi.number().default(3306),
        DB_HOST: Joi.alternatives().try(
          Joi.string().ip(),
          Joi.string().domain(),
        ),
        DB_TYPE: Joi.string().valid('mysql', 'postgres'),
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_SYNC: Joi.boolean().default(false),
        LOG_ON: Joi.boolean(),
        LOG_LEVEL: Joi.string(),
      }),
    }),
    TypeOrmModule.forRoot(connectionParams),
    UserModule,
    LogsModule,
    RolesModule,
    AuthModule,
    MenusModule,
  ],
  controllers: [],
  providers: [
    Logger,
    // 在这里使用全局守卫 能够使用DI
    // {
    // provide: APP_GUARD,
    // useClass: JwtGuard
    // }
  ],
  exports: [Logger],
})
export class AppModule {}
