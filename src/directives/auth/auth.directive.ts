import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import * as assert from 'assert';
import {
    GqlDirectiveFactory,
    SchemaTransform,
} from 'config/graphql.module.config';
import {
    AuthProperties,
    CurrentUser,
    CurrentUserKey,
} from 'directives/auth/current-user.decorator';
import { Request } from 'express';
import { GraphQLFieldConfig } from 'graphql';
import { AuthService } from 'modules/auth/auth.service';

@Injectable()
export class AuthDirective implements GqlDirectiveFactory {
    readonly typeDefs = /* GraphQL */ `
        directive @auth on FIELD_DEFINITION
    `;
    private readonly userPromiseSymbol = Symbol('user promise on req');

    constructor(private readonly authService: AuthService) {}

    create(): SchemaTransform {
        return (schema) =>
            mapSchema(schema, {
                [MapperKind.FIELD]: (
                    fieldConfig: GraphQLFieldConfig<
                        unknown,
                        { req: Request },
                        unknown
                    >,
                ) => {
                    const directiveArgs: AuthProperties | undefined =
                        getDirective(schema, fieldConfig, 'auth')?.[0];

                    if (directiveArgs) {
                        const { resolve } = fieldConfig;
                        fieldConfig.resolve = async (
                            source,
                            args,
                            context,
                            info,
                        ) => {
                            // prevents retrieving user more than once
                            // can be called concurently
                            context.req[this.userPromiseSymbol] ||=
                                this.setUserFromToken(context.req);

                            const user: CurrentUser = await context.req[
                                this.userPromiseSymbol
                            ];

                            return this.validatePermission(directiveArgs, user)
                                ? resolve?.(source, args, context, info)
                                : null;
                        };
                    }

                    return fieldConfig;
                },
            });
    }

    private validatePermission(
        authProperties: AuthProperties,
        currentUser: CurrentUser,
    ): boolean {
        //TODO
        return !!currentUser;
    }

    private setUserFromToken(req: Request) {
        const token = this.tokenFromRequest(req);

        assert(token);

        return this.setUserOnContext(req, token);
    }

    private tokenFromRequest = (req: Request) =>
        req.header('Authorization')?.replace('Bearer ', '');

    private async setUserOnContext(req: Request, token: string) {
        const { id } = await this.authService.fromToken(token);

        return (req[CurrentUserKey] = { id });
    }
}
