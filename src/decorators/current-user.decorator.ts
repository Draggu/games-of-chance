import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserKey = Symbol('current user key on ctx');

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => ctx[CurrentUserKey],
);
