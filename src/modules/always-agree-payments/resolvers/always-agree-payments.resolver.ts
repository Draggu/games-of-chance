import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/current-user.decorator';
import { CurrentUser } from 'directives/auth/types';
import { BalanceDirective } from 'directives/balance/balance-directive.decorator';
import { BalanceEntity } from '../entites/balance.entity';
import { AlwaysAgreePaymentsService } from '../services/always-agree-payments.service';

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
