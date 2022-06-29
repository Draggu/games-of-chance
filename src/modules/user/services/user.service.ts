import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as assert from 'assert';
import { compare } from 'bcrypt';
import { CurrentUser } from 'directives/auth/types';
import { RegisterInput } from 'modules/auth/dto/auth.input';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

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

        return user as UserEntity;
    }

    create(
        { email, password, name }: RegisterInput,
        manager = this.userRepository.manager,
    ) {
        return manager.save(UserEntity, { email, password, name });
    }

    findById(id: string) {
        return this.userRepository.findOneOrFail({
            where: { id },
        });
    }

    findByIds(ids: string[]) {
        return this.userRepository.find({
            where: {
                id: In(ids),
            },
        });
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
}
