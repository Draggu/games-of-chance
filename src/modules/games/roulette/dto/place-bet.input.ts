import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { RouletteBetColor } from '../consts';

@InputType()
export class PlaceBetInput {
    @IsInt()
    @IsPositive()
    @Field(() => Int)
    amount: number;

    @Field(() => RouletteBetColor)
    @IsEnum(RouletteBetColor)
    color: RouletteBetColor;
}
