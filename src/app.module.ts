import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQlModuleConfig } from 'config/graphql.module.config';
import { TypeOrmModuleConfig } from 'config/typeorm.module.config';
import { DirectivesModule } from 'directives/directives.module';
import { AlwaysAgreePaymentsModule } from 'modules/always-agree-payments/always-agree-payments.module';
import { AuthModule } from 'modules/auth/auth.module';
import { GamesModule } from 'modules/games/games.module';
import { UserModule } from 'modules/user/user.module';
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
            useClass: TypeOrmModuleConfig,
        }),
    ],
})
export class AppModule {}
