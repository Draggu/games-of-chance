import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { randomKeyLength } from 'modules/game-randomizer/consts';
import { RouletteRollEntity } from 'modules/games/roulette/entities/roulette-roll.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
    orderBy: {
        day: 'DESC',
    },
})
@ObjectType()
export class RouletteSeedEntity {
    @PrimaryGeneratedColumn('increment')
    @Field(() => ID)
    id: number;

    @Column({
        unique: true,
        type: 'date',
        default: () => 'CURRENT_DATE',
    })
    @Field(() => Date)
    day: string;

    @Column({
        length: randomKeyLength,
    })
    privateKey: string;

    @Column({
        length: randomKeyLength,
    })
    publicKey: string;

    @OneToMany(() => RouletteRollEntity, (roll) => roll.seed)
    @HideField()
    rolls: RouletteRollEntity[];
}
