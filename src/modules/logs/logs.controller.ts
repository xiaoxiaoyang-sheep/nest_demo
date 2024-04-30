import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { LogsDto, PublicLogsDto } from './dto/log-test.dto';
import { SerializeInterceptor } from '../../common/interceptors/serialize.interceptor';
import { Serialize } from '../../common/decorators/serialize.decorator';
import { ChcekPolicies, Can } from '../../common/decorators/casl.decorator'
import { Action } from '../../common/enum/action.enum';
import { Logs } from './logs.entity';
import { CaslGuard } from '../../common/guards/casl.guard';
import { JwtGuard } from '../../common/guards/jwt.guard';
import { AdminGuard } from '../../common/guards/admin.guard';

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
