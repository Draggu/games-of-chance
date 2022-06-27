import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import * as assert from 'assert';
import { GqlDirectiveFactory } from 'config/graphql.module.config';
import { Request } from 'express';
import { SchemaTransform } from 'helpers/schema/transform';
import { AuthService } from 'modules/auth/services/auth.service';
import { currentUserSymbol, userPromiseSymbol } from './consts';
import { onlyOwnNullableTypes, onlyOwnRule } from './rules/only-own.rule';
import { optionalRule } from './rules/optional.rule';
import { AuthProperties, CurrentUser, FieldConfig, Result } from './types';

@Injectable()
export class AuthDirective implements GqlDirectiveFactory {
    readonly typeDefs = /* GraphQL */ `
        """
        requires authorization

        allowed forms:
            - http headers
                - Authorization: Bearer <token>
        """
        directive @auth(
            optional: Boolean = false
            onlyOwn: Boolean = false
        ) on FIELD_DEFINITION
    `;

    constructor(private readonly authService: AuthService) {}

    create(): SchemaTransform {
        return (schema) =>
            mapSchema(schema, {
                [MapperKind.FIELD]: (fieldConfig: FieldConfig) => {
                    const directiveArgs = getDirective(
                        schema,
                        fieldConfig,
                        'auth',
                    )?.[0] as AuthProperties | undefined;

                    if (directiveArgs) {
                        if (directiveArgs.onlyOwn) {
                            onlyOwnNullableTypes(fieldConfig);
                        }

                        const { resolve } = fieldConfig;

                        fieldConfig.resolve = async (
                            parent,
                            args,
                            context,
                            info,
                        ) => {
                            // prevents retrieving user more than once
                            // can be called concurently
                            context.req[userPromiseSymbol] ||=
                                this.setUserFromToken(context.req);

                            const user: CurrentUser | undefined = await context
                                .req[userPromiseSymbol];

                            const result = (await resolve?.(
                                parent,
                                args,
                                context,
                                info,
                            )) as Result;

                            return [
                                optionalRule(user),
                                onlyOwnRule(parent, info, user),
                            ].reduce(
                                (result, rule) => rule(result, directiveArgs),
                                result,
                            );
                        };
                    }

                    return fieldConfig;
                },
            });
    }

    private async setUserFromToken(
        req: Request,
    ): Promise<CurrentUser | undefined> {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        assert(token);

        const maybeUser = await this.authService.fromToken(token);

        if (maybeUser) {
            req[currentUserSymbol] = { id: maybeUser.id };
        }

        return req[currentUserSymbol];
    }
}
