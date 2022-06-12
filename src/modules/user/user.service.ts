import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        id: string,
        {
            email,
            password,
            name,
        }: { email?: string; password?: string; name?: string },
    ) {
        return this.userRepository.save({ id, email, password, name });
    }
}
