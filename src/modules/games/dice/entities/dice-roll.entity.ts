import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { DiceRollSide, DiceRollSideDbName } from '../consts';
import { DiceSeedEntity } from './dice-seed.entity';

@Entity()
@ObjectType()
export class DiceRollEntity {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int, {
        name: 'nonce',
    })
    id: number;

    @Column({
        enum: DiceRollSide,
        enumName: DiceRollSideDbName,
    })
    side: DiceRollSide;

    @Column()
    @Field(() => Int)
    chances: number;

    @Column()
    @Field(() => Int)
    winning: number;

    @Column()
    @Field(() => Int)
    amount: number;

    @Column()
    won: boolean;

    @Column({ type: 'timestamp', default: () => 'NOW()' })
    createdAt: Date;

    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'userId' })
    @HideField()
    user: UserEntity;

    @RelationId((seed: DiceRollEntity) => seed.user)
    @HideField()
    userId: string;

    @ManyToOne(() => DiceSeedEntity, (seed) => seed.rolls)
    @JoinColumn({ name: 'seedId' })
    @HideField()
    seed: DiceSeedEntity;

    @RelationId((roll: DiceRollEntity) => roll.seed)
    @HideField()
    seedId: string;
}
