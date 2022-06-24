import { Injectable } from '@nestjs/common';
import { CurrentUser } from 'directives/auth/current-user.decorator';
import { UserBalanceService } from 'modules/user/services/user-balance.service';

@Injectable()
export class AlwaysAgreePaymentsService {
    constructor(private readonly userBalanceService: UserBalanceService) {}

    async deposit(currentUser: CurrentUser, amount: number) {
        return {
            balance: await this.userBalanceService.updateBalance(
                currentUser,
                amount,
                '+',
            ),
        };
    }

    async withdraw(currentUser: CurrentUser, amount: number) {
        return {
            balance: await this.userBalanceService.updateBalance(
                currentUser,
                amount,
                '-',
            ),
        };
    }
}
