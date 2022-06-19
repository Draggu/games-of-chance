import { InputType } from '@nestjs/graphql';
import { IsEmail, ValidateIf } from 'class-validator';

@InputType()
export class UpdateUserInput {
    name?: string;

    @ValidateIf((o: UpdateUserInput) => typeof o.email === 'string')
    @IsEmail()
    email?: string;

    password?: string;
}
