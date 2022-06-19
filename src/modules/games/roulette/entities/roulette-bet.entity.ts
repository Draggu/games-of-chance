import { Field, HideField, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { BetColor } from '../consts';
import { RouletteRollEntity } from './roulette-roll.entity';

@Entity()
@ObjectType()
export class RouletteBetEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ManyToOne(() => UserEntity, (user) => user.rouletteBets, {
        nullable: false,
    })
    @JoinColumn({ name: 'userId' })
    @HideField()
    user: UserEntity;

    @RelationId((bet: RouletteBetEntity) => bet.user)
    @HideField()
    userId: string;

    @ManyToOne(() => RouletteRollEntity, (roll) => roll.bets, {
        nullable: false,
    })
    @JoinColumn({ name: 'rollId' })
    @HideField()
    roll: RouletteRollEntity;

    @RelationId((bet: RouletteBetEntity) => bet.roll)
    @HideField()
    rollId: string;

    @Column({ type: 'integer' })
    amount: number;

    @Column({ type: 'enum', enum: BetColor, enumName: 'BetColor' })
    @Field(() => BetColor)
    color: BetColor;

    @Column({ default: false, nullable: false })
    @HideField()
    isRewarded: boolean;
}
