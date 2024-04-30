import { INestApplication, Logger, ValidationPipe } from "@nestjs/common";
import { AllExceptionFilter } from "./common/filters/all-exception.filter";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { HttpAdapterHost } from "@nestjs/core";
import { getServiceConfig } from "../ormconfig";
import { SuccessResponse } from "./common/interceptors/success_response.interceptor";
import helmet from 'helmet';
import rateLimit from 'express-rate-limit'

export const setupApp = (app: INestApplication) => {
    const config = getServiceConfig()
    const flag: boolean = config['LOG_ON'] === 'true'

    flag && app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
    app.setGlobalPrefix('api/v1');
  
    const httpAdapter = app.get(HttpAdapterHost);
    // 全局Filter只能有一个
    const logger = new Logger();
    app.useGlobalFilters(new AllExceptionFilter(logger, httpAdapter));
  
    // 全局管道
    app.useGlobalPipes(new ValidationPipe({
      // 去除在类上不存在的字段
      whitelist: true
    }))
  
    // 全局守卫
    // app.useGlobalGuards()
    // 弊端 -> 无法使用DI -> 无法访问userService
  
    // 全局拦截器
    // 统一返回格式
    app.useGlobalInterceptors(new SuccessResponse())

    // helmet头不安全
    app.use(helmet())

    // rateLimit限速
    app.use(
        rateLimit({
            windowMs: 1 * 60 * 1000, // 1 min
            limit: 100, // limit each IP to 100 requests per windowMs
        })
    )

}