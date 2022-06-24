import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQlModuleConfig } from 'config/graphql.module.config';
import { DirectivesModule } from 'directives/directives.module';
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
            useClass: GraphQlModuleConfig,
            imports: [DirectivesModule],
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
})
export class AppModule {}
