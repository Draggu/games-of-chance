import { Field, HideField, ID, Int, ObjectType } from '@nestjs/graphql';
import { Ownership } from 'directives/auth/decorators/ownership.decorator';
import { Check, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BalanceNotNegativeConstraint } from '../consts';

@Entity()
@Check(BalanceNotNegativeConstraint, '"balance" >= 0')
@ObjectType()
export class UserEntity {
    static readonly saltRound = 10;

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ select: false })
    @HideField()
    password: string;

    @Column()
    @Ownership('id')
    email: string;

    @Column({ type: 'integer', default: 0 })
    @Ownership('id')
    @Field(() => Int)
    balance: number;
}
