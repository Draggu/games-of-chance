import { Module } from '@nestjs/common';
import { JwtModuleWrapper } from 'infrastructure/jwt/jwt-wrapper.module';
import { AuthController } from './auth.controller';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';

@Module({
    imports: [JwtModuleWrapper],
    providers: [AuthResolver, AuthService],
    exports: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
