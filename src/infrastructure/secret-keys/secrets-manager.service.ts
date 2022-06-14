import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'crypto';
import { schedule } from 'node-cron';
import Redlock from 'redlock';
import { Repository } from 'typeorm';
import { KeyKind } from './consts';
import { SecretKeyEntity } from './enitities/secret-key.entity';

export interface SecretKeeper {
    get(): string;
}

class SecretWrapper implements SecretKeeper {
    constructor(private secret: string, readonly keyType: KeyKind) {}

    get() {
        return this.secret;
    }

    set(secret: string) {
        this.secret = secret;
    }
}

@Injectable()
export class SecretsManagerService implements OnModuleInit {
    constructor(
        @InjectRepository(SecretKeyEntity)
        private readonly keyRepository: Repository<SecretKeyEntity>,
        private readonly redlock: Redlock,
    ) {}

    private wrappers: Record<KeyKind, SecretWrapper>;

    async onModuleInit() {
        const keys = await this.loadKeys();

        this.createWrappers(keys);

        this.scheduleKeyCreation();
    }

    getOwner(key: KeyKind) {
        return this.wrappers[key];
    }

    private generateKey() {
        return randomBytes(32).toString('hex');
    }

    private scheduleKeyCreation() {
        schedule('0 0 * * *', () => {
            const keys = Object.keys(KeyKind).map((type: KeyKind) => ({
                type,
                key: this.generateKey(),
            }));

            this.redlock
                .using(['key-generator'], 5000, async () => {
                    await this.keyRepository.insert(keys);
                })
                .catch(() => {});
        });
    }

    private createWrappers(keys: SecretKeyEntity[]) {
        this.wrappers = Object.fromEntries(
            keys.map(({ key, type }) => [type, new SecretWrapper(key, type)]),
        ) as Record<KeyKind, SecretWrapper>;
    }

    private loadKeys(): Promise<SecretKeyEntity[]> {
        return this.keyRepository
            .createQueryBuilder()
            .select()
            .from(SecretKeyEntity, 'KeyEntity')
            .distinctOn(['KeyEntity.type'])
            .orderBy('KeyEntity.day', 'DESC')
            .limit(Object.keys(KeyKind).length)
            .execute();
    }
}
