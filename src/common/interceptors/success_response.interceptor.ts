import {
  Injectable,
  NestInterceptor,
  CallHandler,
  ExecutionContext,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

interface Data<T> {
  data: T;
  code: number;
  msg: string;
}

export class SuccessResponse<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map(({ data = null, msg = '请求成功', code = 200, success = true }) => {      
        return { code, msg, data, success };
      }),
    );
  }
}
