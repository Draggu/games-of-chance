import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteTimesService } from '../services/roulette-times.service';

@Injectable()
export class RouletteRollDataloader extends DataLoader<
    number,
    RouletteRollEntity | null
> {
    constructor(
        @InjectRepository(RouletteRollEntity)
        private readonly rouletteRollRepository: Repository<RouletteRollEntity>,
        private readonly rouletteTimesService: RouletteTimesService,
    ) {
        super(async (betIds) => {
            const timestamp =
                this.rouletteTimesService.nowBackedOfIncreasedBetTime();

            const rolls = await this.rouletteRollRepository
                .createQueryBuilder('roll')
                .innerJoin('roll.bets', 'bets')
                .addSelect('bets.id', 'betId')
                .where('bets.id IN (:...betIds)', { betIds })
                .andWhere(`"createdAt" < ${timestamp}`)
                .getRawAndEntities<{ betId: string }>();

            const rollsByBet = Object.fromEntries(
                rolls.entities.map(
                    (roll, i) => [rolls.raw[i].betId, roll] as const,
                ),
            );

            return betIds.map((betId) => rollsByBet[betId] || null);
        });
    }
}
