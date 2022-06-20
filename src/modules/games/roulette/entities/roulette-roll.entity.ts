import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { RouletteSeedEntity } from 'modules/games/roulette/entities/roulette-seed.entity';
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
import { RouletteBetColor, RouletteBetColorDbName } from '../consts';
import { RouletteBetEntity } from './roulette-bet.entity';

@Entity({
    orderBy: {
        timestamp: 'DESC',
    },
})
@ObjectType()
export class RouletteRollEntity {
    @PrimaryGeneratedColumn('increment')
    @Field(() => Int, {
        name: 'nonce',
    })
    id: number;

    @Column({ type: 'smallint', nullable: false })
    @Field(() => Int)
    winning: number;

    @Column({
        type: 'enum',
        enum: RouletteBetColor,
        enumName: RouletteBetColorDbName,
        asExpression: `(
            CASE 
                WHEN winning = 14 THEN
                    '${RouletteBetColor.GREEN}'::"${RouletteBetColorDbName}"
                WHEN winning % 2 = 0 THEN
                    '${RouletteBetColor.BLACK}'::"${RouletteBetColorDbName}"
                ELSE  '${RouletteBetColor.RED}'::"${RouletteBetColorDbName}"
            END
        )`,
        generatedType: 'STORED',
        generatedIdentity: 'ALWAYS',
    })
    color: RouletteBetColor;

    @ManyToOne(() => RouletteSeedEntity, (seed) => seed.rouletteRoll)
    @JoinColumn({ name: 'seedId' })
    @HideField()
    seed: RouletteSeedEntity;

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
