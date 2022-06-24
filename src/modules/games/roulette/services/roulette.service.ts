import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/current-user.decorator';
import { sha256 } from 'helpers/sha256';
import { GameRandomizerService } from 'modules/game-randomizer/game-randomizer.service';
import { RouletteSeedEntity } from 'modules/games/roulette/entities/roulette-seed.entity';
import { Repository } from 'typeorm';
import { PlaceRouletteBetInput } from '../dto/place-bet.input';
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
        private readonly rouletteSeedRepository: Repository<RouletteSeedEntity>,
        private readonly gameRandomizerService: GameRandomizerService,
        private readonly rouletteTimesService: RouletteTimesService,
    ) {}

    async onModuleInit() {
        await Promise.allSettled([
            this.rouletteStatsRepository.insert({}),
            this.rouletteSeedRepository.insert({
                id: 1,
                privateKey: this.gameRandomizerService.generateKey(),
                publicKey: this.gameRandomizerService.generateKey(),
            }),
        ]);
    }

    async placeBet(
        currentUser: CurrentUser,
        { amount, color }: PlaceRouletteBetInput,
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
        const seeds = await this.rouletteSeedRepository.find({
            take,
            skip: take * skip,
        });

        // first page first result is today one
        if (skip === 0) {
            const [todaySeed, ...otherSeeds] = seeds;
            const safeTodaySeed = {
                ...todaySeed,
                privateKey: sha256(todaySeed.privateKey),
                isHashed: true,
            };

            return [safeTodaySeed, ...otherSeeds];
        }

        return seeds;
    }
}
