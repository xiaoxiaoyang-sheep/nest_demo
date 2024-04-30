import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

@Injectable()
export class SerializeInterceptor implements NestInterceptor {

  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    // const req = context.switchToHttp().getRequest()
    // console.log('这里在拦截器执行之前', req);
    return next.handle().pipe(map(({data}) => {
      // console.log('这是在拦截器执行之后', data);
      // return data
      const filterData = plainToInstance(this.dto, data, {
        // 设置为true之后，所有经过该interceptor的接口都需要设置Expose或Exclude
        // Expose设置哪些字段需要暴露
        // Exclude设置哪些字段不需要暴露
        excludeExtraneousValues: true
      })
      
      return {
        ...data,
        data: filterData
      }
    }));
  }
}
