import { Field, FieldMiddleware, HideField, ObjectType } from '@nestjs/graphql';
import { sha256 } from 'helpers/sha256';
import { randomKeyLength } from 'modules/game-randomizer/consts';
import { UserEntity } from 'modules/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    PrimaryColumn,
    RelationId,
} from 'typeorm';
import { DiceRollEntity } from './dice-roll.entity';

const hashMiddleware: FieldMiddleware = (_, next) => next().then(sha256);

@Entity()
@ObjectType()
export class DiceSeedEntity {
    @Column({
        nullable: true,
        length: randomKeyLength,
    })
    previousServerSeed?: string;

    @Column({
        length: randomKeyLength,
    })
    @Field({
        middleware: [hashMiddleware],
    })
    serverSeed: string;

    @Column({
        length: randomKeyLength,
    })
    @Field({
        middleware: [hashMiddleware],
    })
    nextServerSeed: string;

    @Column({
        length: 64,
    })
    clientSeed: string;

    @OneToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    @HideField()
    user: UserEntity;

    @PrimaryColumn()
    @RelationId((seed: DiceSeedEntity) => seed.user)
    @HideField()
    userId: string;

    @OneToMany(() => DiceRollEntity, (roll) => roll.seed)
    @HideField()
    rolls: DiceRollEntity[];
}
