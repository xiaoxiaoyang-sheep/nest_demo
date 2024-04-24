import { Injectable } from '@nestjs/common';
import { GetUserDto } from 'src/user/dto/get-user.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UserService) {}

    async signin(username: string, password: string) {
        const res = await this.userService.findAll({username} as GetUserDto)
        return res
    }

    async signup(username: string, password: string) {
        const res = await this.userService.create({username, password})
        return res
    }
}
