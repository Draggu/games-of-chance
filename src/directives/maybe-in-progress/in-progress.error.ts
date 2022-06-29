import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class InProgressError {
    static create(data: InProgressError) {
        return Object.assign(new InProgressError(), data);
    }

    @Field(() => Date)
    closedAt: Date;

    @Field(() => Date, {
        nullable: true,
    })
    nextOpenAt?: Date;
}
