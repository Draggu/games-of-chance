import { Directive, Field, InputType, Int } from '@nestjs/graphql';
import { DiceRollSide, unreachableChances } from '../consts';

@InputType()
export class DiceRollInput {
    @Field(() => Int)
    @Directive(
        /* GraphQL */ `@constraint(min:1, exclusiveMax:${unreachableChances})`,
    )
    chances: number;

    @Field(() => DiceRollSide, {
        defaultValue: DiceRollSide.LOWER,
    })
    side: DiceRollSide;

    @Field(() => Int)
    @Directive(/* GraphQL */ `@constraint(min:1)`)
    amount: number;
}
