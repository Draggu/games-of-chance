import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { OneRowTable } from 'helpers/one-row-table';
import { Column, Entity } from 'typeorm';

@Entity()
@ObjectType()
export class RouletteStatsEntity {
    @OneRowTable()
    @HideField()
    @Exclude()
    id: number;

    @Column({
        type: 'integer',
        default: 0,
    })
    @Field(() => Int)
    greenCount: number;

    @Column({
        type: 'integer',
        default: 0,
    })
    @Field(() => Int)
    blackCount: number;

    @Column({
        type: 'integer',
        default: 0,
    })
    @Field(() => Int)
    redCount: number;
}
