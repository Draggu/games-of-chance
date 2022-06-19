import { InputType, PickType } from '@nestjs/graphql';
import { IsEmail, IsString } from 'class-validator';

@InputType()
export class RegisterInput {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    password: string;
}

@InputType()
export class LoginInput extends PickType(RegisterInput, [
    'email',
    'password',
]) {}
