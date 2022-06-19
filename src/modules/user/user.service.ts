import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'decorators/current-user.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    findByCredentials({
        password,
        email,
    }: {
        password: string;
        email: string;
    }) {
        return this.userRepository.findOneOrFail({
            where: { password, email },
        });
    }

    findById(id: string) {
        return this.userRepository.findOneOrFail({
            where: { id },
        });
    }

    create({
        email,
        password,
        name,
    }: {
        email: string;
        password: string;
        name: string;
    }) {
        return this.userRepository.save({ email, password, name });
    }

    update(
        currentUser: CurrentUser,
        {
            email,
            password,
            name,
        }: { email?: string; password?: string; name?: string },
    ) {
        return this.userRepository.save({
            id: currentUser.id,
            email,
            password,
            name,
        });
    }

    deposit(currentUser: CurrentUser, amount: number) {
        return this.updateBalance(currentUser, amount, '+');
    }

    withdraw(currentUser: CurrentUser, amount: number) {
        return this.updateBalance(currentUser, amount, '-');
    }

    private updateBalance(
        currentUser: CurrentUser,
        amount: number,
        sign: '+' | '-',
    ): Promise<number> {
        return this.updateBalanceParamLessQuery(sign)
            .where(`id = :userId`)
            .setParameters({
                userId: currentUser.id,
                amount,
            })
            .returning('balance')
            .execute()
            .then((result) => result.raw[0]);
    }

    updateBalanceParamLessQuery(sign: '+' | '-', amount = ':amount') {
        return this.userRepository.manager
            .createQueryBuilder()
            .update(UserEntity)
            .set({
                balance: () => `balance ${sign} ${amount}`,
            });
    }
}
