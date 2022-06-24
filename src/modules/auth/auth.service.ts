import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'modules/user/services/user.service';
import { LoginInput, RegisterInput } from './dto/auth.input';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    async register(userData: RegisterInput) {
        const user = await this.userService.create(userData);
        const token = this.jwtService.sign({ id: user.id });

        return { user, token };
    }

    async login(credentials: LoginInput) {
        const user = await this.userService.findByCredentials(credentials);
        const token = this.jwtService.sign({ id: user.id });

        return { user, token };
    }

    fromToken(token: string) {
        const { id } = this.jwtService.verify<{ id: string }>(token);

        return this.userService.findById(id);
    }
}
