import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, Max, Min } from 'class-validator';
import { DiceRollSide, unreachableChances } from '../consts';

@InputType()
export class DiceRollInput {
    @Max(unreachableChances)
    @Min(1)
    @Field(() => Int)
    chances: number;

    @Field(() => DiceRollSide, {
        defaultValue: DiceRollSide.LOWER,
    })
    @IsEnum(DiceRollSide)
    side: DiceRollSide;

    @Field(() => Int)
    @Min(1)
    amount: number;
}
