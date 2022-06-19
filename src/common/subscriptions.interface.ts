import { RouletteRollEntity } from 'modules/games/roulette/entities/roulette-roll.entity';
import { SeedEntity } from 'modules/seeds/enitities/seed.entity';
import { UserEntity } from 'modules/user/entities/user.entity';

//TODO
export interface Subscriptions {
    seed: SeedEntity;
    userUpdate: UserEntity;
    onRouletteRoll: number;
    onRouletteResults: RouletteRollEntity;
}
