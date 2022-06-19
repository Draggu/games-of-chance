import { registerEnumType } from '@nestjs/graphql';

export enum BetColor {
    RED = 'red',
    GREEN = 'green',
    BLACK = 'black',
}

registerEnumType(BetColor, {
    name: 'BetColor',
});
