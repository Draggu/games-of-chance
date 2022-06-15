import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { randomBytes } from 'crypto';
import { sha256 } from 'helpers/sha256';
import { CronService } from 'infrastructure/cron/cron.service';
import { Repository } from 'typeorm';
import { SeedEntity } from './enitities/seed.entity';

@Injectable()
export class SeedsService implements OnModuleInit {
    constructor(
        @InjectRepository(SeedEntity)
        private readonly keyRepository: Repository<SeedEntity>,
        private readonly cronService: CronService,
    ) {}

    private lastSeed: SeedEntity;

    async onModuleInit() {
        await this.loadSeed();

        this.scheduleKeyCreation();
    }

    getPublicKey() {
        return this.lastSeed.publicKey;
    }

    getPrivateKey() {
        return this.lastSeed.privateKey;
    }

    private generateKey() {
        return randomBytes(32).toString('hex');
    }

    private scheduleKeyCreation() {
        this.cronService.schedule('0 0 * * *', 'keys-creation', (done) =>
            this.keyRepository.manager.transaction((manager) =>
                manager
                    .insert(SeedEntity, {
                        privateKey: this.generateKey(),
                        publicKey: this.generateKey(),
                    })
                    .then(done),
            ),
        );
    }

    private async loadSeed() {
        const [seed] = await this.keyRepository.find({
            order: {
                day: 'DESC',
            },
            take: 1,
        });

        this.lastSeed = seed;
    }

    async findSeeds({ take, skip }: PageInput) {
        const seeds = await this.keyRepository.find({
            order: {
                day: 'DESC',
            },
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
