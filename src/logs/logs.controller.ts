import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { LogsDto, PublicLogsDto } from './dto/log-test.dto';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Serialize } from '../decorators/serialize.decorator';
import { ChcekPolicies, Can } from '../decorators/casl.decorator'
import { Action } from '../enum/action.enum';
import { Logs } from './logs.entity';
import { CaslGuard } from '../guards/casl.guard';
import { JwtGuard } from '../guards/jwt.guard';
import { AdminGuard } from '../guards/admin.guard';

@Controller('logs')
@UseGuards(JwtGuard, CaslGuard)
@ChcekPolicies((ability) => ability.can(Action.Read, Logs))
@Can(Action.Read, Logs)
export class LogsController {

    @Get()
    @Can(Action.Update, Logs)
    getLogs() {
        return 'test'
    }


    @Post()
    @Serialize(PublicLogsDto)
    // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
    logTest(@Body() dto: LogsDto) {
        console.log(dto);
        return dto
    }

}
