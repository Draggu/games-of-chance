import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Directive } from '@nestjs/graphql';
import { getRequest } from 'helpers/get-request';
import { jsonToGraphQLQuery } from 'json-to-graphql-query';
import { UserEntity } from 'modules/user/entities/user.entity';

export const CurrentUserKey = Symbol('current user key on ctx');

export interface AuthProperties {}

export const Auth = (authProperties: AuthProperties = {}) =>
    createParamDecorator(
        (_: unknown, ctx: ExecutionContext) => getRequest(ctx)[CurrentUserKey],
        [
            (target, propertyKey) =>
                Directive(
                    jsonToGraphQLQuery({ '@auth': { __args: authProperties } }),
                )(
                    target,
                    propertyKey,
                    Object.getOwnPropertyDescriptor(target, propertyKey)!,
                ),
        ],
    )(authProperties);

export type CurrentUser = Pick<UserEntity, 'id'>;
