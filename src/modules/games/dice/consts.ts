import { registerEnumType } from '@nestjs/graphql';

export enum DiceRollSide {
    UPPER = 'upper',
    LOWER = 'lower',
}

registerEnumType(DiceRollSide, {
    name: 'DiceRollSide',
});

export const DiceRollSideDbName = 'DiceRollSide';

export const unreachableChances = 100_000;
