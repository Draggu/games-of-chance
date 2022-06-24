import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DatabaseError } from 'pg';
import { QueryFailedError } from 'typeorm';
import { BalanceNotNegativeConstraint } from '../../modules/user/consts';

@ObjectType()
export class BalanceTooLowError {
    static create(
        error: unknown,
        amount: number,
    ): BalanceTooLowError | undefined {
        const isDbError = (
            err: unknown,
        ): err is QueryFailedError & DatabaseError =>
            err instanceof QueryFailedError;

        if (
            isDbError(error) &&
            error.code === '23514' &&
            error.constraint === BalanceNotNegativeConstraint
        ) {
            const balanceUnder0 = parseInt(
                /\-(\d+)\)\.$/.exec(error.detail!)![0],
            );
            const currentBalance = balanceUnder0 + amount;

            return new BalanceTooLowError(currentBalance, amount);
        }
    }

    private constructor(currentBalance: number, chargeAmount: number) {
        this.currentBalance = currentBalance;
        this.chargeAmount = chargeAmount;
    }

    @Field(() => Int)
    currentBalance: number;

    @Field(() => Int)
    chargeAmount: number;
}
