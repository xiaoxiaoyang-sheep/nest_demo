import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigEnum } from '../../common/enum/config.enum';
import { JwtStrategy } from './auth.strategy';
import { CaslAbilityService } from './casl.ability.service';

@Global()
@Module({
  imports: [UserModule, PassportModule, JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      secret: configService.get<string>(ConfigEnum.SECRET),
      signOptions: {
        expiresIn: '1d'
      }
    }),
    inject: [ConfigService]
  })],
  providers: [AuthService, JwtStrategy, CaslAbilityService],
  exports: [CaslAbilityService],
  controllers: [AuthController]
})
export class AuthModule {}
