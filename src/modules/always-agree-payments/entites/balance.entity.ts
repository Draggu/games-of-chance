import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BalanceEntity {
    @Field(() => Int)
    balance: number;
}
