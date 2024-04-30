import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type CurUserType = {
  userId: number;
  username: string
}

export const CurUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest()
    const curUser: CurUserType = req.user
    return curUser;
  },
);
