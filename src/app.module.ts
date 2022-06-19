import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { cors } from 'common/cors';
import { AuthGuard } from 'guards/auth.guard';
import { AlwaysAgreePaymentsModule } from 'modules/always-agree-payments/always-agree-payments.module';
import { AuthModule } from 'modules/auth/auth.module';
import { GameRandomizerModule } from 'modules/game-randomizer/game-randomizer.module';
import { SeedsModule } from 'modules/seeds/seeds.module';
import { UserModule } from 'modules/user/user.module';
import { join } from 'path';
import { GamesModule } from './modules/games/games.module';
@Module({
    imports: [
        AlwaysAgreePaymentsModule,
        UserModule,
        AuthModule,
        GameRandomizerModule,
        SeedsModule,
        GamesModule,
        ConfigModule.forRoot({ expandVariables: true, isGlobal: true }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
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
                logging: config.get('NODE_ENV') !== 'production',
                subscribers: [join(__dirname, '/**/*.subscriber.{ts,js}')],
                //dropSchema: true,
            }),
        }),
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
