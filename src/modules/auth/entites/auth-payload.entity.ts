import { ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/entities/user.entity';
import { AuthTokenEntity } from './auth-token.entity';

@ObjectType()
export class AuthPayload {
    user: UserEntity;

    token: AuthTokenEntity;
}
