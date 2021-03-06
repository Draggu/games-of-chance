import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronService } from 'infrastructure/cron/cron.service';
import { PubSubService } from 'infrastructure/pub-sub/pub-sub.service';
import { GameRandomizerService } from 'modules/game-randomizer/services/game-randomizer.service';
import { DataSource, Repository } from 'typeorm';
import { RouletteBetColor } from '../consts';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteSeedEntity } from '../entities/roulette-seed.entity';
import { RouletteTimesService } from '../services/roulette-times.service';

@Injectable()
export class RouletteGameStartScheduler implements OnModuleInit {
    private readonly jobName = 'roulette-create-game';

    constructor(
        @InjectRepository(RouletteSeedEntity)
        private readonly rouletteSeedRepository: Repository<RouletteSeedEntity>,
        @InjectRepository(RouletteRollEntity)
        private readonly rouletteRollRepository: Repository<RouletteRollEntity>,
        private readonly rouletteTimesService: RouletteTimesService,
        private readonly gameRandomizerService: GameRandomizerService,
        private readonly cronService: CronService,
        private readonly pubSubService: PubSubService,
        private readonly dataSource: DataSource,
    ) {}

    getJob() {
        return this.cronService.getJob(this.jobName);
    }

    onModuleInit() {
        const { roundTime } = this.rouletteTimesService;
        this.cronService.schedule(
            `0/${roundTime} * * * * *`,
            this.jobName,
            async (done) => {
                const [lastRoll, lastSeed] = await Promise.all([
                    this.rouletteRollRepository.findOne({
                        where: {},
                    }),
                    this.rouletteSeedRepository.findOneOrFail({
                        order: {
                            day: 'DESC',
                        },
                        where: {},
                    }),
                ]);

                const nextId = lastRoll ? lastRoll.id + 1 : 1;
                const { roll } = this.gameRandomizerService.result({
                    privateKey: lastSeed.privateKey,
                    publicKey: lastSeed.publicKey,
                    range: 15,
                    nonce: nextId,
                });
                const color =
                    roll === 14
                        ? RouletteBetColor.GREEN
                        : roll % 2 == 0
                        ? RouletteBetColor.BLACK
                        : RouletteBetColor.RED;

                await this.dataSource.transaction(async (manager) => {
                    await manager.insert(RouletteRollEntity, {
                        id: nextId,
                        // sync roll date with date of seed used to generate id
                        seed: {
                            id: lastSeed.id,
                        },
                        winning: roll,
                        color,
                    });

                    await done();
                });

                await this.pubSubService.publish('onRouletteRoll', nextId);
            },
        );
    }
}
