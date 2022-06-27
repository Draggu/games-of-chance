import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { Injectable } from '@nestjs/common';
import { GqlDirectiveFactory } from 'config/graphql.module.config';
import { Request } from 'express';
import {
    assertObjectType,
    GraphQLFieldConfig,
    GraphQLUnionType,
    isNonNullType,
    isObjectType,
    isUnionType,
} from 'graphql';
import { SchemaTransform } from 'helpers/schema/transform';
import { BalanceTooLowError } from './balance-to-low.error';

@Injectable()
export class BalanceDirective implements GqlDirectiveFactory {
    readonly typeDefs = /* GraphQL */ `
        """
        requires balance to be high enough
        if it's too low returns BalanceTooLowError
        """
        directive @balance on FIELD_DEFINITION
    `;

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
                    const directiveArgs = getDirective(
                        schema,
                        fieldConfig,
                        'balance',
                    )?.[0];

                    if (directiveArgs) {
                        const type = isNonNullType(fieldConfig.type)
                            ? fieldConfig.type.ofType
                            : fieldConfig.type;
                        const errorType = assertObjectType(
                            schema.getType(BalanceTooLowError.name),
                        );

                        if (isUnionType(type)) {
                            const { types, name, resolveType, ...config } =
                                type.toConfig();

                            fieldConfig.type = new GraphQLUnionType({
                                ...config,
                                types: [...types, errorType],
                                name: `${name}Or${errorType.name}`,
                                resolveType: (
                                    value: unknown,
                                    context,
                                    info,
                                    abstractType,
                                ) =>
                                    value instanceof BalanceTooLowError
                                        ? errorType.name
                                        : resolveType!(
                                              value,
                                              context,
                                              info,
                                              abstractType,
                                          ),
                            });
                        } else if (isObjectType(type)) {
                            const name = `${type.name}Or${errorType.name}`;

                            fieldConfig.type = new GraphQLUnionType({
                                types: [type, errorType],
                                name,
                                resolveType: (value: unknown) =>
                                    value instanceof BalanceTooLowError
                                        ? errorType.name
                                        : type.name,
                            });
                        } else {
                            throw new Error(`
                            unsupported type for @balance directive
                            exptected union or object type
                            received: ${type}
                        `);
                        }

                        const { resolve } = fieldConfig;

                        fieldConfig.resolve = async (
                            source,
                            args,
                            context,
                            info,
                        ) => {
                            try {
                                return await resolve?.(
                                    source,
                                    args,
                                    context,
                                    info,
                                );
                            } catch (err) {
                                if (err instanceof BalanceTooLowError) {
                                    return err;
                                }
                                throw err;
                            }
                        };
                    }

                    return fieldConfig;
                },
            });
    }
}
