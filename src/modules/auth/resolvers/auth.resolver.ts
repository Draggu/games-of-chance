import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/current-user.decorator';
import { CurrentUser } from 'directives/auth/types';
import { LoginInput, RegisterInput } from '../dto/auth.input';
import { AuthPayload } from '../entites/auth-payload.entity';
import { UserToken } from '../entites/auth-token.entity';
import { AuthService } from '../services/auth.service';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}

    @Mutation(() => AuthPayload)
    register(
        @Args('register') registerInput: RegisterInput,
    ): Promise<AuthPayload> {
        return this.authService.register(registerInput);
    }

    @Mutation(() => AuthPayload)
    login(@Args('login') loginInput: LoginInput): Promise<AuthPayload> {
        return this.authService.login(loginInput);
    }

    @Mutation(() => UserToken)
    logout(
        @Auth() currentUser: CurrentUser,
        @Args('register') tokenName: string,
    ): Promise<UserToken> {
        return this.authService.logout(currentUser, tokenName);
    }
}
