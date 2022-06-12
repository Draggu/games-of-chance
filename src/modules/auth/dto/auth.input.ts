import { InputType, PickType } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RegisterInput {
    @IsEmail()
    email: string;
    name: string;
    password: string;
}

@InputType()
export class LoginInput extends PickType(RegisterInput, [
    'email',
    'password',
]) {}
