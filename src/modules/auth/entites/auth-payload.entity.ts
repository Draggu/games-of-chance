import { Field } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/entities/user.entity';

export class AuthPayload {
    @Field(() => UserEntity)
    user: UserEntity;

    token: string;
}
