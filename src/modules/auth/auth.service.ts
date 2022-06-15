import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class AuthService {
    constructor(
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
        const { id } = this.jwtService.verify<{ id: string }>(token);

        return this.userService.findById(id);
    }
}
