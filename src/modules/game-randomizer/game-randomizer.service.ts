import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { SeedsService } from 'modules/seeds/seeds.service';
@Injectable()
export class GameRandomizerService {
    constructor(private readonly keysManager: SeedsService) {}

    result(n: number, nonce: string | number): { key: string; roll: number } {
        const clientSeed = this.keysManager.getPublicKey();
        const serverSeed = this.keysManager.getPrivateKey();
        const seed = [serverSeed, clientSeed, nonce].join('-');

        const subHash = createHmac('sha256', seed)
            .digest('hex')
            .substring(0, 8);

        const spinNumber = parseInt(subHash, 16);
        const roll = Math.abs(spinNumber) % n;

        return {
            key: subHash,
            roll,
        };
    }
}
