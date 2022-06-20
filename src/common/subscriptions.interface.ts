import { RouletteRollEntity } from 'modules/games/roulette/entities/roulette-roll.entity';
import { RouletteSeedEntity } from 'modules/games/roulette/entities/roulette-seed.entity';
import { UserEntity } from 'modules/user/entities/user.entity';

//TODO
export interface Subscriptions {
    seed: RouletteSeedEntity;
    userUpdate: UserEntity;
    onRouletteRoll: number;
    onRouletteResults: RouletteRollEntity;
}
