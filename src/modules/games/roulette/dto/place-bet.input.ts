import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsPositive } from 'class-validator';
import { RouletteBetColor } from '../consts';

@InputType()
export class PlaceBetInput {
    @IsPositive()
    @Field(() => Int)
    amount: number;

    @Field(() => RouletteBetColor)
    @IsEnum(RouletteBetColor)
    color: RouletteBetColor;
}
