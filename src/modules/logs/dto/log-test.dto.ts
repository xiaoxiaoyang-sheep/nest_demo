import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class LogsDto {
  @IsString()
  @IsNotEmpty()
  msg: string;

  // 如果开启whitelist，没有校验装饰器也会被过滤
  @IsString()
  id: string;
}

export class PublicLogsDto {
  @Expose()
  msg: string;
}
