import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { RouletteBetEntity } from 'modules/games/roulette/entities/roulette-bet.entity';
import {
    Check,
    Column,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
@Check('"balance" >= 0')
@ObjectType()
export class UserEntity {
    static readonly saltRound = 10;

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ select: false })
    password: string;

    @Column()
    email: string;

    @Column({ type: 'integer', default: 0 })
    @Field(() => Int)
    balance: number;

    // bets history

    @OneToMany(() => RouletteBetEntity, (bet) => bet.user)
    @HideField()
    rouletteBets: RouletteBetEntity[];
}
