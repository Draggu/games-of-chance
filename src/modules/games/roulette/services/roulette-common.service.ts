import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RouletteCommonService {
    constructor(private readonly config: ConfigService) {}

    readonly roundTime = this.config.get('ROULETTE_FULL_ROUND_TIME', 20);
    readonly allowBetTime = this.config.get('ROULETTE_ALLOW_BET_TIME', 15);

    nowWithBetTime() {
        const now = new Date();

        now.setSeconds(now.getSeconds() + this.allowBetTime);

        return now;
    }
}
