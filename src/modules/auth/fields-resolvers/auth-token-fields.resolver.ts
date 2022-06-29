import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { UserToken } from '../entites/auth-token.entity';

@Resolver(() => UserToken)
export class AuthTokenFieldsResolver {
    @ResolveField(() => Boolean)
    isExpired(
        @Parent() token: UserToken,
        @Context('startTime') startTime: number,
    ): boolean {
        return token.expiresAt.getTime() < startTime;
    }
}
