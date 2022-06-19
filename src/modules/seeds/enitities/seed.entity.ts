import { ObjectType } from '@nestjs/graphql';
import { RouletteRollEntity } from 'modules/games/roulette/entities/roulette-roll.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class SeedEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        unique: true,
        type: 'date',
        default: () => 'CURRENT_DATE',
    })
    day: string;

    @Column()
    privateKey: string;

    @Column()
    publicKey: string;

    // games

    @OneToMany(() => RouletteRollEntity, (roll) => roll.seed)
    rouletteRoll: RouletteRollEntity;
}
