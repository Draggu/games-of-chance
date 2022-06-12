import { Mutation, Resolver } from '@nestjs/graphql';
import { DisableAuth } from 'decorators/disable-auth.decorator';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './dto/auth.input';
import { AuthPayload } from './entites/auth-payload.entity';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthPayload)
    @DisableAuth()
    login(loginInput: LoginInput) {
        return this.authService.login(loginInput);
    }

    @Mutation(() => AuthPayload)
    @DisableAuth()
    register(registerInput: RegisterInput) {
        return this.authService.register(registerInput);
    }
}