import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser } from 'decorators/current-user.decorator';
import { UserEntity } from 'modules/user/entities/user.entity';
import { AlwaysAgreePaymentsService } from './always-agree-payments.service';

@Resolver()
export class AlwaysAgreePaymentsResolver {
    constructor(
        private readonly alwaysAgreePaymentsService: AlwaysAgreePaymentsService,
    ) {}

    @Mutation(() => Boolean)
    deposit(
        @CurrentUser() currentUser: UserEntity,
        @Args('value', { type: () => Int }) value: number,
    ) {
        return this.alwaysAgreePaymentsService.deposit(currentUser, value);
    }

    @Mutation(() => Boolean)
    withdraw(
        @CurrentUser() currentUser: UserEntity,
        @Args('value', { type: () => Int }) value: number,
    ) {
        return this.alwaysAgreePaymentsService.withdraw(currentUser, value);
    }
}
