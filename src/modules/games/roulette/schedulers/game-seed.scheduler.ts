import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronService } from 'infrastructure/cron/cron.service';
import { GameRandomizerService } from 'modules/game-randomizer/game-randomizer.service';
import { Repository } from 'typeorm';
import { RouletteSeedEntity } from '../entities/roulette-seed.entity';

@Injectable()
export class RouletteSeedScheduler implements OnModuleInit {
    constructor(
        @InjectRepository(RouletteSeedEntity)
        private readonly rouletteSeedRepository: Repository<RouletteSeedEntity>,
        private readonly gameRandomizerService: GameRandomizerService,
        private readonly cronService: CronService,
    ) {}

    onModuleInit() {
        this.cronService.schedule(
            '0 0 * * *',
            'seed-creation',
            async (done) => {
                const privateKey = this.gameRandomizerService.generateKey();
                const publicKey = this.gameRandomizerService.generateKey();

                await this.rouletteSeedRepository.manager.transaction(
                    async (manager) => {
                        await manager.insert(RouletteSeedEntity, {
                            privateKey,
                            publicKey,
                        });

                        await done();
                    },
                );
            },
        );
    }
}
