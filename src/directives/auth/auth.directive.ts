import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import { GqlDirectiveFactory } from 'config/graphql.module.config';
import { Request } from 'express';
import { SchemaTransform } from 'helpers/schema/transform';
import { AuthService } from 'modules/auth/services/auth.service';
import { currentUserSymbol, userPromiseSymbol } from './consts';
import { optionalRule } from './rules/optional.rule';
import { ownershipNullableTypes, ownershipRule } from './rules/ownership.rule';
import { AuthProperties, CurrentUser, FieldConfig, RuleNext } from './types';

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
            """
            if resource is not owned by current user field id nulled
            """
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
                            ownershipNullableTypes(fieldConfig);
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

                            const firstResolve = (() =>
                                resolve?.(
                                    parent,
                                    args,
                                    context,
                                    info,
                                )) as RuleNext;

                            // rules are lazy
                            // call next one if they passed
                            const finalResolve = [
                                optionalRule(user),
                                ownershipRule(parent, info, user),
                            ].reduce(
                                (nextRule, rule) =>
                                    rule(nextRule, directiveArgs),
                                firstResolve,
                            );

                            return finalResolve();
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

        if (token) {
            const user = await this.authService.fromToken(token);

            if (user) {
                req[currentUserSymbol] = user;
            }
        }

        return req[currentUserSymbol];
    }
}
