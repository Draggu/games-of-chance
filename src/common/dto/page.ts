import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, Max } from 'class-validator';

@InputType()
export class PageInput {
    @IsNumber()
    @Max(20)
    @Field(() => Int, {
        defaultValue: 10,
    })
    take: number = 10;

    @IsNumber()
    @Field(() => Int, {
        defaultValue: 0,
    })
    skip: number = 0;
}
