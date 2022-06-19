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
        private readonly seedRepository: Repository<SeedEntity>,
        private readonly cronService: CronService,
    ) {}

    private lastSeed: SeedEntity;

    async onModuleInit() {
        try {
            this.lastSeed = await this.seedRepository.findOneOrFail({
                order: {
                    day: 'DESC',
                },
                where: {},
            });
        } catch {
            this.lastSeed = await this.seedRepository
                .insert({
                    id: 1,
                    privateKey: this.generateKey(),
                    publicKey: this.generateKey(),
                })
                .then(({ generatedMaps }) => generatedMaps[0] as SeedEntity);
        }

        this.cronService.schedule(
            '0 0 * * *',
            'seed-creation',
            async (done) => {
                await this.seedRepository.manager.transaction(
                    async (manager) => {
                        await manager.insert(SeedEntity, {
                            privateKey: this.generateKey(),
                            publicKey: this.generateKey(),
                        });

                        await done();
                    },
                );
            },
        );
    }

    getSeedId() {
        return this.lastSeed.id;
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

    async findSeeds({ take, skip }: PageInput) {
        const seeds = await this.seedRepository.find({
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
