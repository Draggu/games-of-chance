import { ApolloDriverConfig } from '@nestjs/apollo';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlOptionsFactory } from '@nestjs/graphql';
import { cors } from 'common/cors';
import { AuthDirective } from 'directives/auth/auth.directive';
import { BalanceTooLowError } from 'directives/balance/balance-to-low.error';
import { BalanceDirective } from 'directives/balance/balance.directive';
import { GraphQLSchema, lexicographicSortSchema } from 'graphql';
import {
    constraintDirective,
    constraintDirectiveTypeDefs,
} from 'graphql-constraint-directive';
import { printSchemaToFile } from 'helpers/schema/print';
import { transformSchema } from 'helpers/schema/transform';

export type SchemaTransform = (schema: GraphQLSchema) => GraphQLSchema;

export interface GqlDirectiveFactory {
    typeDefs: string;
    create(): SchemaTransform;
}

@Injectable()
export class GraphQlModuleConfig implements GqlOptionsFactory {
    constructor(
        private readonly config: ConfigService,
        private readonly authDirective: AuthDirective,
        private readonly balanceDirective: BalanceDirective,
    ) {}

    createGqlOptions(): Omit<ApolloDriverConfig, 'driver'> {
        return {
            cors,
            debug: this.config.get('NODE_ENV') !== 'production',
            playground: false,
            subscriptions: {
                'graphql-ws': true,
            },
            autoSchemaFile: true,
            transformAutoSchemaFile: true,
            transformSchema: transformSchema({
                beforePrint: [
                    this.authDirective.create(),
                    this.balanceDirective.create(),
                    lexicographicSortSchema,
                ],
                afterPrint: [constraintDirective()],
                typeDefs: [
                    constraintDirectiveTypeDefs,
                    this.authDirective.typeDefs,
                    this.balanceDirective.typeDefs,
                ],
                print: printSchemaToFile('schema.gql'),
            }),
            fieldResolverEnhancers: ['filters'],
            context: ({ req }) => ({ req }),
            buildSchemaOptions: {
                orphanedTypes: [BalanceTooLowError],
            },
        };
    }
}
