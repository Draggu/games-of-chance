import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput, RegisterInput } from './dto/auth.input';
import { AuthPayload } from './entites/auth-payload.entity';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthPayload)
    login(@Args('login') loginInput: LoginInput): Promise<AuthPayload> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => AuthPayload)
    register(
        @Args('register') registerInput: RegisterInput,
    ): Promise<AuthPayload> {
        return this.authService.register(registerInput);
    }
}
