import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { getRequest } from 'helpers/get-request';
import { UserEntity } from 'modules/user/entities/user.entity';

export const CurrentUserKey = Symbol('current user key on ctx');

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => getRequest(ctx)[CurrentUserKey],
);

export type CurrentUser = Pick<UserEntity, 'id'>;
