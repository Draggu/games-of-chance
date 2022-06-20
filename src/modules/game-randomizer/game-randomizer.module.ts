import { Module } from '@nestjs/common';
import { GameRandomizerService } from './game-randomizer.service';

@Module({
    providers: [GameRandomizerService],
    exports: [GameRandomizerService],
})
export class GameRandomizerModule {}
