import { Module } from '@nestjs/common';
import { GameRandomizerService } from './services/game-randomizer.service';

@Module({
    providers: [GameRandomizerService],
    exports: [GameRandomizerService],
})
export class GameRandomizerModule {}
