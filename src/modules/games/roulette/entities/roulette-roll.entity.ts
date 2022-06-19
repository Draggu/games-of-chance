import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Exclude, Expose } from 'class-transformer';
import { SeedEntity } from 'modules/seeds/enitities/seed.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    RelationId,
} from 'typeorm';
import { BetColor } from '../consts';
import { RouletteBetEntity } from './roulette-bet.entity';

@Entity()
@ObjectType()
export class RouletteRollEntity {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int, {
        name: 'nonce',
    })
    @Expose({
        name: 'nonce',
    })
    id: number;

    @Column({ type: 'smallint', nullable: false })
    @Field(() => Int)
    winning: number;

    @Column({
        type: 'enum',
        enum: BetColor,
        enumName: 'BetColor',
        asExpression: `(
            CASE 
                WHEN winning = 14 THEN '${BetColor.GREEN}'::"BetColor"
                WHEN winning % 2 = 0 THEN '${BetColor.BLACK}'::"BetColor"
                ELSE '${BetColor.RED}'::"BetColor"
            END
        )`,
        generatedType: 'STORED',
        generatedIdentity: 'ALWAYS',
    })
    color: BetColor;

    @ManyToOne(() => SeedEntity, (seed) => seed.rouletteRoll)
    @JoinColumn({ name: 'seedId' })
    @HideField()
    @Exclude()
    seed: SeedEntity;

    @RelationId((roll: RouletteRollEntity) => roll.seed)
    @HideField()
    seedId: number;

    @Index('get_newest_one_faster')
    @CreateDateColumn()
    timestamp: Date;

    @OneToMany(() => RouletteBetEntity, (bet) => bet.roll)
    @HideField()
    bets: RouletteBetEntity[];
}
