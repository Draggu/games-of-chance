import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Directive } from '@nestjs/graphql';
import { getRequest } from 'helpers/get-request';
import { currentUserSymbol } from '../consts';
import { prepareAuthDirective } from '../prepare';
import { AuthProperties } from '../types';

export const Auth = (authProperties?: AuthProperties) =>
    createParamDecorator(
        (_: unknown, ctx: ExecutionContext) =>
            getRequest(ctx)[currentUserSymbol],
        [
            (target, propertyKey) =>
                Directive(prepareAuthDirective(authProperties))(
                    target,
                    propertyKey,
                    Object.getOwnPropertyDescriptor(target, propertyKey)!,
                ),
        ],
    )(authProperties);
