import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'decorators/current-user.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AlwaysAgreePaymentsService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    deposit(currentUser: CurrentUser, value: number) {
        return this.updateBalance(currentUser, value, true);
    }

    withdraw(currentUser: CurrentUser, value: number) {
        return this.updateBalance(currentUser, value, false);
    }

    private updateBalance(
        currentUser: CurrentUser,
        value: number,
        increment: boolean,
    ) {
        return this.userRepository
            .createQueryBuilder()
            .update(UserEntity)
            .where('id = :id', {
                id: currentUser.id,
            })
            .set({
                balance: () => `balance ${increment ? '+' : '-'} :value`,
            })
            .setParameter('value', value)
            .execute()
            .then((result) => !!result.affected)
            .catch(() => false);
    }
}
