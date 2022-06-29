import { Injectable } from '@nestjs/common';
import { CurrentUser } from 'directives/auth/types';
import { UserService } from 'modules/user/services/user.service';
import { DataSource } from 'typeorm';
import { LoginInput, RegisterInput } from '../dto/auth.input';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly tokenService: TokenService,
        private readonly dataSource: DataSource,
    ) {}

    register(userData: RegisterInput) {
        return this.dataSource.transaction(async (manager) => {
            const user = await this.userService.create(userData, manager);
            const token = await this.tokenService.create(
                user.id,
                userData.tokenName,
                manager,
            );

            return { user, token };
        });
    }

    async login(credentials: LoginInput) {
        const user = await this.userService.findByCredentials(credentials);
        const token = await this.tokenService.create(
            user.id,
            credentials.tokenName,
        );

        return { user, token };
    }

    logout(currentUser: CurrentUser, tokenName: string) {
        return this.tokenService.destroyToken(currentUser, tokenName);
    }

    fromToken(token: string) {
        return this.tokenService.currentUserByToken(token);
    }
}
