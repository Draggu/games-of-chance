import { Module } from '@nestjs/common';
import { JwtModuleWrapper } from 'infrastructure/jwt/jwt-wrapper.module';
import { UserModule } from 'modules/user/user.module';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
    imports: [JwtModuleWrapper, UserModule],
    providers: [AuthResolver, AuthService],
    exports: [AuthService],
})
export class AuthModule {}
