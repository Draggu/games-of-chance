import { Directive, InputType, PickType } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
    @Directive(/* GraphQL */ `@constraint(format:"email")`)
    email: string;

    name: string;

    password: string;
}

@InputType()
export class LoginInput extends PickType(RegisterInput, [
    'email',
    'password',
]) {}
