import { Directive, InputType } from '@nestjs/graphql';

@InputType()
export class UpdateUserInput {
    name?: string;

    @Directive(/* GraphQL */ `@constraint(format:"email")`)
    email?: string;

    password?: string;
}
