import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import { In } from 'typeorm';
import { AuthTokenEntity } from '../entites/auth-token.entity';
import { TokenService } from '../services/token.service';

@Injectable()
export class TokenDataloader extends DataLoader<string, AuthTokenEntity[]> {
    constructor(private readonly tokenService: TokenService) {
        super(async (userIds) => {
            const tokens = await this.tokenService
                .notExpiredTokensQuery()
                .andWhere({
                    user: {
                        id: In(userIds as string[]),
                    },
                })
                .getMany();

            const tokenByUser = _.groupBy(tokens, (token) => token.userId);

            return userIds.map((userId) => tokenByUser[userId]);
        });
    }
}
