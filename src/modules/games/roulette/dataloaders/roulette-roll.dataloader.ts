import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
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
                .addSelect('bets.id', 'betId')
                .innerJoin('roll.bets', 'bets')
                .where('bets.id IN (:...betIds)', { betIds })
                .andWhere(`"createdAt" < ${timestamp}`)
                .getRawAndEntities<{ betId: string; roll_id: string }>();

            const rollsByBet = Object.fromEntries(
                rolls.raw.map((roll) => [roll.betId, roll.roll_id] as const),
            );

            const rollsById = _.keyBy(rolls.entities, 'id');

            return betIds.map((betId) => rollsById[rollsByBet[betId]] || null);
        });
    }
}
