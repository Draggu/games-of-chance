import { Module } from '@nestjs/common';
import { KeyKind } from 'infrastructure/secret-keys/consts';
import { SecretKeysModule } from 'infrastructure/secret-keys/secret-keys.module';
import {
    GameRandomizerService,
    PRIVATE_KEY_KEEPER,
    PUBLIC_KEY_KEEPER,
} from './game-randomizer.service';

@Module({
    imports: [
        SecretKeysModule.forFeature({
            keyType: KeyKind.PRIVATE,
            token: PRIVATE_KEY_KEEPER,
        }),
        SecretKeysModule.forFeature({
            keyType: KeyKind.PUBLIC,
            token: PUBLIC_KEY_KEEPER,
        }),
    ],
    providers: [GameRandomizerService],
})
export class GameRandomizerModule {}
