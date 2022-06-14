import { Inject, Injectable } from '@nestjs/common';
import { createHash, createHmac } from 'crypto';
import { SecretKeeper } from 'infrastructure/secret-keys/secrets-manager.service';

export const PRIVATE_KEY_KEEPER = 'PRIVATE_KEY_KEEPER';
export const PUBLIC_KEY_KEEPER = 'PUBLIC_KEY_KEEPER';

@Injectable()
export class GameRandomizerService {
    constructor(
        @Inject(PRIVATE_KEY_KEEPER) private readonly privateKey: SecretKeeper,
        @Inject(PUBLIC_KEY_KEEPER) private readonly publicKey: SecretKeeper,
    ) {}

    result(
        n: number,
        extra: string | number,
    ): { key: string; hash: string; roll: number } {
        const clientSeed = this.publicKey.get();
        const serverSeed = this.privateKey.get();
        const seed = [serverSeed, clientSeed, extra].join('-');

        const subHash = createHmac('sha256', seed)
            .digest('hex')
            .substring(0, 8);
        const spinNumber = parseInt(subHash, 16);
        const roll = Math.abs(spinNumber) % n;
        const hashedKey = createHash('sha256').update(subHash).digest('hex');

        return {
            key: subHash,
            hash: hashedKey,
            roll,
        };
    }
}
