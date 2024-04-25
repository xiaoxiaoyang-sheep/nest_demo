import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { LogsDto, PublicLogsDto } from './dto/log-test.dto';
import { SerializeInterceptor } from 'src/interceptors/serialize.interceptor';
import { Serialize } from 'src/decorators/serialize.decorator';

@Controller('logs')
export class LogsController {

    @Post()
    @Serialize(PublicLogsDto)
    // @UseInterceptors(new SerializeInterceptor(PublicLogsDto))
    logTest(@Body() dto: LogsDto) {
        console.log(dto);
        return dto
    }

}
