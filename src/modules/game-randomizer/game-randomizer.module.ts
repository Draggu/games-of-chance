import { Module } from '@nestjs/common';
import { KeysModule } from 'modules/random-keys/random-keys.module';
import { GameRandomizerService } from './game-randomizer.service';

@Module({
    imports: [KeysModule],
    providers: [GameRandomizerService],
    exports: [GameRandomizerService],
})
export class GameRandomizerModule {}
