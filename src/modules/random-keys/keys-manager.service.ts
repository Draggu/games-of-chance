import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { CronService } from 'infrastructure/cron/cron.service';
import { Repository } from 'typeorm';
import { KeyKind } from './consts';
import { RandomKeyEntity } from './enitities/random-key.entity';

@Injectable()
export class KeysManagerService implements OnModuleInit {
    constructor(
        @InjectRepository(RandomKeyEntity)
        private readonly keyRepository: Repository<RandomKeyEntity>,
        private readonly cronService: CronService,
    ) {}

    private wrappers: Record<KeyKind, string>;
    private readonly keys = Object.keys(KeyKind);

    async onModuleInit() {
        const keys = await this.loadKeys();

        this.createWrappers(keys);

        this.scheduleKeyCreation();
    }

    get(key: KeyKind) {
        return this.wrappers[key];
    }

    private generateKey() {
        return randomBytes(32).toString('hex');
    }

    private scheduleKeyCreation() {
        this.cronService.schedule(
            '0 0 * * *',
            'keys-creation',
            async (done) => {
                const keys = this.keys.map((type: KeyKind) => ({
                    type,
                    key: this.generateKey(),
                }));

                await this.keyRepository.manager.transaction(
                    async (manager) => {
                        await manager.insert(RandomKeyEntity, keys);
                        await done();
                    },
                );
            },
        );
    }

    private createWrappers(keys: RandomKeyEntity[]) {
        this.wrappers = Object.fromEntries(
            keys.map(({ key, type }) => [type, key]),
        ) as Record<KeyKind, string>;
    }

    private loadKeys(): Promise<RandomKeyEntity[]> {
        return this.keyRepository
            .createQueryBuilder('keys')
            .select()
            .distinctOn(['keys.type'])
            .orderBy('keys.day', 'DESC')
            .orderBy('keys.type', 'DESC')
            .limit(this.keys.length)
            .execute();
    }
}
