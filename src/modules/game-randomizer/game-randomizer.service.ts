import { Injectable } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';
@Injectable()
export class GameRandomizerService {
    generateKey() {
        return randomBytes(32).toString('hex');
    }

    result({
        privateKey,
        publicKey,
        range,
        nonce,
    }: {
        privateKey: string;
        publicKey: string;
        range: number;
        nonce: string | number;
    }): { key: string; roll: number } {
        const seed = [privateKey, publicKey, nonce].join('-');

        const subHash = createHmac('sha256', seed)
            .digest('hex')
            .substring(0, 8);

        const spinNumber = parseInt(subHash, 16);
        const roll = Math.abs(spinNumber) % range;

        return {
            key: subHash,
            roll,
        };
    }
}
