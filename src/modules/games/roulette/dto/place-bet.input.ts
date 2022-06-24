import { Directive, Field, InputType, Int } from '@nestjs/graphql';
import { RouletteBetColor } from '../consts';

@InputType()
export class PlaceRouletteBetInput {
    @Field(() => Int)
    @Directive(/* GraphQL */ `@constraint(exclusiveMin:0)`)
    amount: number;

    @Field(() => RouletteBetColor)
    color: RouletteBetColor;
}
