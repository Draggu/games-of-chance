import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { Repository } from 'typeorm';
import { AuthTokenEntity } from '../entites/auth-token.entity';

@Injectable()
export class TokenService {
    constructor(
        @InjectRepository(AuthTokenEntity)
        private readonly authTokenRepository: Repository<AuthTokenEntity>,
    ) {}

    create(
        userId: string,
        tokenName: string,
        manager = this.authTokenRepository.manager,
    ) {
        return manager.save(AuthTokenEntity, {
            user: {
                id: userId,
            },
            name: tokenName,
        });
    }

    currentUserByToken(token: string): Promise<CurrentUser | null> {
        return this.notExpiredTokensQuery()
            .andWhere('auth.token = :token', { token })
            .getOne()
            .then((token) => (token ? { id: token.userId } : null));
    }

    destroyToken(
        currentUser: CurrentUser,
        tokenName: string,
    ): Promise<AuthTokenEntity> {
        return this.authTokenRepository
            .createQueryBuilder()
            .delete()
            .where({
                user: currentUser,
                name: tokenName,
            })
            .returning('*')
            .execute()
            .then(({ raw }) => raw[0]);
    }

    notExpiredTokensQuery() {
        return this.authTokenRepository
            .createQueryBuilder('auth')
            .where('"expiresAt" > NOW()');
    }
}
