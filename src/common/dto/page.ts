import { Directive, Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PageInput {
    @Field(() => Int, {
        defaultValue: 10,
    })
    @Directive(/* GraphQL */ `@constraint(exclusiveMin:0, max:20)`)
    take: number = 10;

    @Field(() => Int, {
        defaultValue: 0,
    })
    @Directive(/* GraphQL */ `@constraint(min:0)`)
    skip: number = 0;
}
