import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'modules/user/user.service';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(userData: {
        name: string;
        email: string;
        password: string;
    }) {
        const user = await this.userService.create(userData);
        const token = this.jwtService.sign({ id: user.id });

        return { user, token };
    }

    async login(credentials: { email: string; password: string }) {
        const user = await this.userService.findByCredentials(credentials);
        const token = this.jwtService.sign({ id: user.id });

        return { user, token };
    }

    fromToken(token: string) {
        const id: string = this.jwtService.verify(token).id;

        return this.userService.findById(id);
    }
}
