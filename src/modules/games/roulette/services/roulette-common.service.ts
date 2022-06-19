import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';

@Injectable()
export class RouletteCommonService {
    constructor(
        @InjectRepository(RouletteRollEntity)
        private readonly rouletteRollRepository: Repository<RouletteRollEntity>,
        private readonly config: ConfigService,
    ) {}

    readonly roundTime = this.config.get('ROULETTE_FULL_ROUND_TIME', 20);
    readonly allowBetTime = this.config.get('ROULETTE_ALLOW_BET_TIME', 15);

    nowWithBetTime(
        extra = Math.floor((this.roundTime - this.allowBetTime) / 2),
    ) {
        return `NOW() - INTERVAL '${this.allowBetTime + extra} seconds'`;
    }

    currentRoll() {
        const qb = this.rouletteRollRepository
            .createQueryBuilder()
            .orderBy('timestamp', 'DESC');

        return qb;
    }
}
