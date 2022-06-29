import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'modules/user/user.module';
import { AuthTokenEntity } from './entites/auth-token.entity';
import { AuthTokenFieldsResolver } from './fields-resolvers/auth-token-fields.resolver';
import { UserTokenFieldsResolver } from './fields-resolvers/user-token-fields.resolver';
import { AuthResolver } from './resolvers/auth.resolver';
import { AuthService } from './services/auth.service';
import { TokenService } from './services/token.service';

@Module({
    imports: [UserModule, TypeOrmModule.forFeature([AuthTokenEntity])],
    providers: [
        AuthResolver,
        UserTokenFieldsResolver,
        AuthTokenFieldsResolver,
        AuthService,
        TokenService,
    ],
    exports: [AuthService],
})
export class AuthModule {}
