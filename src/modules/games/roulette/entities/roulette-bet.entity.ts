import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserEntity } from 'modules/user/entities/user.entity';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { RouletteBetColor, RouletteBetColorDbName } from '../consts';
import { RouletteRollEntity } from './roulette-roll.entity';

@Entity()
@ObjectType()
export class RouletteBetEntity {
    @PrimaryGeneratedColumn('increment')
    @Field(() => ID)
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
    @Field(() => Int)
    amount: number;

    @Column({
        type: 'enum',
        enum: RouletteBetColor,
        enumName: RouletteBetColorDbName,
    })
    @Field(() => RouletteBetColor)
    color: RouletteBetColor;

    @Column({ default: false, nullable: false })
    @HideField()
    isRewarded: boolean;
}
