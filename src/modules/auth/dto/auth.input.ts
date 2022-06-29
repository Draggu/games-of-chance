import { Directive, InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
    @Directive(/* GraphQL */ `@constraint(format:"email")`)
    email: string;

    name: string;

    password: string;

    tokenName: string;
}

@InputType()
export class LoginInput extends OmitType(RegisterInput, ['name']) {}
