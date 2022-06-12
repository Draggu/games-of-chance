import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AlwaysAgreePaymentsService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    deposit(currentUser: UserEntity, value: number) {
        return this.updateBalance(currentUser, value, true);
    }

    withdraw(currentUser: UserEntity, value: number) {
        return this.updateBalance(currentUser, value, false);
    }

    private updateBalance(
        currentUser: UserEntity,
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
