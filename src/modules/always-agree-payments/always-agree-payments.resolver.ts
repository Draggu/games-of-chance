import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'decorators/current-user.decorator';
import { AlwaysAgreePaymentsService } from './always-agree-payments.service';

@Resolver()
export class AlwaysAgreePaymentsResolver {
    constructor(
        private readonly alwaysAgreePaymentsService: AlwaysAgreePaymentsService,
    ) {}

    @Mutation(() => Int)
    deposit(
        @CurrentUser() currentUser: CurrentUser,
        @Args('value', { type: () => Int }) value: number,
    ): Promise<number> {
        return this.alwaysAgreePaymentsService.deposit(currentUser, value);
    }

    @Mutation(() => Int)
    withdraw(
        @CurrentUser() currentUser: CurrentUser,
        @Args('value', { type: () => Int }) value: number,
    ): Promise<number> {
        return this.alwaysAgreePaymentsService.withdraw(currentUser, value);
    }
}
