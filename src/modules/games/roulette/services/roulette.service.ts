import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { sha256 } from 'helpers/sha256';
import { RouletteSeedEntity } from 'modules/games/roulette/entities/roulette-seed.entity';
import { Repository } from 'typeorm';
import { PlaceBetInput } from '../dto/place-bet.input';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteStatsEntity } from '../entities/roulette-stats.entity';
import { RouletteTimesService } from './roulette-times.service';

@Injectable()
export class RouletteService implements OnModuleInit {
    constructor(
        @InjectRepository(RouletteRollEntity)
        private readonly rouletteRollRepository: Repository<RouletteRollEntity>,
        @InjectRepository(RouletteStatsEntity)
        private readonly rouletteStatsRepository: Repository<RouletteStatsEntity>,
        @InjectRepository(RouletteBetEntity)
        private readonly rouletteBetRepository: Repository<RouletteBetEntity>,
        @InjectRepository(RouletteSeedEntity)
        private readonly seedRepository: Repository<RouletteSeedEntity>,
        private readonly rouletteTimesService: RouletteTimesService,
    ) {}

    async onModuleInit() {
        await this.rouletteStatsRepository.insert({}).catch(() => {});
    }

    async placeBet(
        currentUser: CurrentUser,
        { amount, color }: PlaceBetInput,
    ): Promise<RouletteBetEntity> {
        const timestamp = this.rouletteTimesService.nowBackedOfBetTime();

        const currentRoll = await this.rouletteRollRepository
            .createQueryBuilder()
            .orderBy('timestamp', 'DESC')
            .where(`timestamp >= ${timestamp}`)
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
        const timestamp =
            this.rouletteTimesService.nowBackedOfIncreasedBetTime();

        return this.rouletteRollRepository
            .createQueryBuilder()
            .orderBy('timestamp', 'DESC')
            .where(`timestamp < ${timestamp}`)
            .skip(skip)
            .take(take)
            .getMany();
    }

    async seedsHistory({ take, skip }: PageInput) {
        const seeds = await this.seedRepository.find({
            take,
            skip: take * skip,
        });

        // first page first result is today one
        if (skip === 0) {
            const [todaySeed, ...otherSeeds] = seeds;
            const safeTodaySeed = {
                ...todaySeed,
                privateKey: sha256(todaySeed.privateKey),
            };

            return [safeTodaySeed, ...otherSeeds];
        }

        return seeds;
    }
}
