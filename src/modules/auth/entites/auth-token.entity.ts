import { HideField, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/entities/user.entity';
import {
    Check,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
    Unique,
} from 'typeorm';

@ObjectType()
export class UserToken {
    @Column()
    name: string;

    @ManyToOne(() => UserEntity)
    @JoinColumn({
        name: 'userId',
    })
    @HideField()
    user: UserEntity;

    @RelationId((token: UserToken) => token.user)
    @HideField()
    userId: string;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => `NOW() + INTERVAL '30 days'` })
    expiresAt: Date;
}
// AuthTokenEntity is created this way to allow fieldResolver inheritance
@Entity()
@ObjectType()
@Unique('unique_token_name_per_user', ['name', 'user'])
@Check(`
    "expiresAt" > "createdAt"
    AND
    "expiresAt" - "createdAt" <= INTERVAL '30 days'
`)
export class AuthTokenEntity extends UserToken {
    @PrimaryGeneratedColumn('uuid')
    token: string;
}
