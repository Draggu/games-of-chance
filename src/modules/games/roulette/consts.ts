import { registerEnumType } from '@nestjs/graphql';

export enum RouletteBetColor {
    RED = 'red',
    GREEN = 'green',
    BLACK = 'black',
}

export const RouletteBetColorDbName = 'RouletteBetColor';

registerEnumType(RouletteBetColor, {
    name: 'RouletteBetColor',
});
