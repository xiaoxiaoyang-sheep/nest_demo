import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtSecretRequestType } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigEnum } from "src/enum/config.enum";


@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(protected configservice: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configservice.get<string>(ConfigEnum.SECRET)
        })
    }

    async validate(payload: any) {
        // req.user
        return { userId: payload.sub, username: payload.username}
    }
}