import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { JwtModuleWrapper } from 'modules/jwt/jwt-wrapper.module';

@Module({
    imports: [JwtModuleWrapper],
    providers: [AuthResolver, AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
