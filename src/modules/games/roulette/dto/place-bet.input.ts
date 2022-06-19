import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { BetColor } from '../consts';

@InputType()
export class PlaceBetInput {
    @IsInt()
    @IsPositive()
    @Field(() => Int)
    amount: number;

    @Field(() => BetColor)
    @IsEnum(BetColor)
    color: BetColor;
}
