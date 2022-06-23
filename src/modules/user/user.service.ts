import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as assert from 'assert';
import { compare } from 'bcrypt';
import { CurrentUser } from 'decorators/current-user.decorator';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
    ) {}

    async findByCredentials({
        password,
        email,
    }: {
        password: string;
        email: string;
    }) {
        const { password: hashedPassword, ...user } = await this.userRepository
            .createQueryBuilder('user')
            .select()
            .addSelect('user.password')
            .where({ email })
            .getOneOrFail();

        assert(compare(password, hashedPassword));

        return this.userRepository.create(user);
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
            .then((result) => result.raw[0].balance);
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
