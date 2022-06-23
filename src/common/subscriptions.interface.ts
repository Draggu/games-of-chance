import { RouletteRollEntity } from 'modules/games/roulette/entities/roulette-roll.entity';

export interface Subscriptions {
    onRouletteRoll: number;
    onRouletteResults: RouletteRollEntity;
}
