import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { Repository } from 'typeorm';
import { PlaceBetInput } from '../dto/place-bet.input';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteStatsEntity } from '../entities/roulette-stats.entity';
import { RouletteCommonService } from './roulette-common.service';

@Injectable()
export class RouletteService implements OnModuleInit {
    constructor(
        @InjectRepository(RouletteRollEntity)
        private readonly rouletteRollRepository: Repository<RouletteRollEntity>,
        @InjectRepository(RouletteStatsEntity)
        private readonly rouletteStatsRepository: Repository<RouletteStatsEntity>,
        @InjectRepository(RouletteBetEntity)
        private readonly rouletteBetRepository: Repository<RouletteBetEntity>,
        private readonly rouletteCommonService: RouletteCommonService,
    ) {}

    async onModuleInit() {
        await this.rouletteStatsRepository.insert({}).catch(() => {});
    }

    async placeBet(
        currentUser: CurrentUser,
        { amount, color }: PlaceBetInput,
    ): Promise<RouletteBetEntity> {
        const currentRoll = await this.rouletteCommonService
            .currentRoll()
            .getOneOrFail();

        return this.rouletteBetRepository.save({
            amount,
            color,
            roll: currentRoll,
            user: currentUser,
        });
    }

    rouletteStats() {
        return this.rouletteStatsRepository.findOneOrFail({
            where: {
                id: 1,
            },
        });
    }

    roulleteHistory({ skip, take }: PageInput) {
        const timestamp = this.rouletteCommonService.nowWithBetTime();

        return this.rouletteRollRepository
            .createQueryBuilder()
            .orderBy('timestamp', 'DESC')
            .where(`timestamp < ${timestamp}`)
            .skip(skip)
            .take(take)
            .getMany();
    }
}
