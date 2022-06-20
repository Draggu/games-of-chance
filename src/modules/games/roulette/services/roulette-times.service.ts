import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RouletteTimesService {
    constructor(private readonly config: ConfigService) {}

    readonly roundTime = this.config.get('ROULETTE_FULL_ROUND_TIME', 20);
    readonly allowBetTime = this.config.get('ROULETTE_ALLOW_BET_TIME', 15);

    nowBackedOfBetTime(extra = 0) {
        return `NOW() - INTERVAL '${this.allowBetTime + extra} seconds'`;
    }

    nowBackedOfIncreasedBetTime() {
        return this.nowBackedOfBetTime(
            Math.floor((this.roundTime - this.allowBetTime) / 2),
        );
    }
}
