import { Body, Controller, Post } from '@nestjs/common';
import { DisableAuth } from 'decorators/disable-auth.decorator';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './dto/auth.input';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('login')
    @DisableAuth()
    login(@Body() loginDto: LoginInput) {
        return this.authService.login(loginDto);
    }

    @Post('register')
    @DisableAuth()
    register(@Body() registerDto: RegisterInput) {
        return this.authService.register(registerDto);
    }
}
