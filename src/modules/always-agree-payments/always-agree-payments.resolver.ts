import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser } from 'directives/auth/current-user.decorator';
import { BalanceDirective } from 'directives/balance/balance-directive.decorator';
import { AlwaysAgreePaymentsService } from './always-agree-payments.service';
import { BalanceEntity } from './entites/balance.entity';

@Resolver()
export class AlwaysAgreePaymentsResolver {
    constructor(
        private readonly alwaysAgreePaymentsService: AlwaysAgreePaymentsService,
    ) {}

    @Mutation(() => BalanceEntity)
    deposit(
        @Auth() currentUser: CurrentUser,
        @Args('amount', { type: () => Int }) amount: number,
    ): Promise<BalanceEntity> {
        return this.alwaysAgreePaymentsService.deposit(currentUser, amount);
    }

    @Mutation(() => BalanceEntity)
    @BalanceDirective()
    withdraw(
        @Auth() currentUser: CurrentUser,
        @Args('amount', { type: () => Int }) amount: number,
    ): Promise<BalanceEntity> {
        return this.alwaysAgreePaymentsService.withdraw(currentUser, amount);
    }
}
