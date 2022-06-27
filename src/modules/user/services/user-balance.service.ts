import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { BalanceTooLowError } from '../../../directives/balance/balance-to-low.error';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserBalanceService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    updateBalance(
        currentUser: CurrentUser,
        amount: number,
        sign: '+' | '-',
        manager = this.userRepository.manager,
    ): Promise<number> {
        return this.updateBalanceParamLessQuery(sign, ':amount', manager)
            .where(`id = :userId`)
            .setParameters({
                userId: currentUser.id,
                amount,
            })
            .returning('balance')
            .execute()
            .then((result) => result.raw[0].balance)
            .catch((err) => {
                const balanceError = BalanceTooLowError.create(err, amount);
                throw balanceError ? balanceError : err;
            });
    }

    updateBalanceParamLessQuery(
        sign: '+' | '-',
        amount = ':amount',
        manager = this.userRepository.manager,
    ) {
        return manager
            .createQueryBuilder()
            .update(UserEntity)
            .set({
                balance: () => `balance ${sign} ${amount}`,
            });
    }
}
