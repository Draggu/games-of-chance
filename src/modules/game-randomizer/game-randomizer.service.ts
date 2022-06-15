import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';
import { KeyKind } from 'modules/random-keys/consts';
import { KeysManagerService } from 'modules/random-keys/keys-manager.service';
@Injectable()
export class GameRandomizerService {
    constructor(private readonly keysManager: KeysManagerService) {}

    result(n: number, nonce: string | number): { key: string; roll: number } {
        const clientSeed = this.keysManager.get(KeyKind.PUBLIC);
        const serverSeed = this.keysManager.get(KeyKind.PRIVATE);
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
