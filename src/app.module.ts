import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { cors } from 'common/cors';
import { AuthGuard } from 'guards/auth.guard';
import { RedisModule } from 'infrastructure/redis/redis.module';
import { SecretKeysModule } from 'infrastructure/secret-keys/secret-keys.module';
import { AlwaysAgreePaymentsModule } from 'modules/always-agree-payments/always-agree-payments.module';
import { AuthModule } from 'modules/auth/auth.module';
import { GameRandomizerModule } from 'modules/game-randomizer/game-randomizer.module';
import { UserModule } from 'modules/user/user.module';
import { PubSubModule } from './infrastructure/pub-sub/pub-sub.module';
@Module({
    imports: [
        AlwaysAgreePaymentsModule,
        UserModule,
        AuthModule,
        GameRandomizerModule,
        SecretKeysModule,
        RedisModule,
        ConfigModule.forRoot({ expandVariables: true }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            useFactory: (config) => ({
                cors,
                debug: config.get('NODE_ENV') !== 'production',
                playground: false,
                sortSchema: true,
                autoSchemaFile: 'schema.gql',
                subscriptions: {
                    'graphql-ws': true,
                },
                fieldResolverEnhancers: ['filters'],
            }),
        }),
        PubSubModule,
    ],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ whitelist: true, transform: true }),
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
