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

    deposit(currentUser: CurrentUser, value: number) {
        return this.updateBalance(currentUser, value, '+');
    }

    withdraw(currentUser: CurrentUser, value: number) {
        return this.updateBalance(currentUser, value, '-');
    }

    private updateBalance(
        currentUser: CurrentUser,
        value: number,
        sign: '+' | '-',
        entityManager = this.userRepository.manager,
    ): Promise<number> {
        return entityManager
            .createQueryBuilder()
            .update()
            .where('id = :id', {
                id: currentUser.id,
            })
            .set({
                balance: () => `balance ${sign} :value`,
            })
            .setParameter('value', value)
            .returning('balance')
            .execute()
            .then((result) => result.raw[0]);
    }
}
