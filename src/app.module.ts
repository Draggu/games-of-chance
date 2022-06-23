import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cors } from 'common/cors';
import { lexicographicSortSchema } from 'graphql';
import {
    constraintDirective,
    constraintDirectiveTypeDefs,
} from 'graphql-constraint-directive';
import { AuthGuard } from 'guards/auth.guard';
import { printSchemaToFile } from 'helpers/schema/print';
import { transformSchema } from 'helpers/schema/transform';
import { AlwaysAgreePaymentsModule } from 'modules/always-agree-payments/always-agree-payments.module';
import { AuthModule } from 'modules/auth/auth.module';
import { GamesModule } from 'modules/games/games.module';
import { UserModule } from 'modules/user/user.module';
import { join } from 'path';
@Module({
    imports: [
        AlwaysAgreePaymentsModule,
        UserModule,
        AuthModule,
        GamesModule,
        ConfigModule.forRoot({ expandVariables: true, isGlobal: true }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                cors,
                debug: config.get('NODE_ENV') !== 'production',
                playground: false,
                subscriptions: {
                    'graphql-ws': true,
                },
                autoSchemaFile: true,
                transformAutoSchemaFile: true,
                transformSchema: transformSchema({
                    beforePrint: [lexicographicSortSchema],
                    afterPrint: [constraintDirective()],
                    typeDefs: [constraintDirectiveTypeDefs],
                    print: printSchemaToFile('schema.gql'),
                }),
                fieldResolverEnhancers: ['filters'],
                context: ({ req }) => ({ req }),
            }),
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'postgres',
                host: config.get('DB_HOST'),
                port: config.get('DB_PORT'),
                username: config.get('DB_USER', 'postgres'),
                password: config.get('DB_PASSWORD'),
                database: config.get('DB_NAME'),
                autoLoadEntities: true,
                migrations: [join(__dirname, '../migrations/*.{ts,js}')],
                migrationsRun: true,
                synchronize: config.get('NODE_ENV') !== 'production',
                logging: config.get('NODE_ENV') !== 'production' && ['query'],
                // dropSchema: true,
            }),
        }),
    ],
    providers: [
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
