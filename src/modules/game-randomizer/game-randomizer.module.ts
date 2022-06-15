import { Module } from '@nestjs/common';
import { SeedsModule } from 'modules/seeds/seeds.module';
import { GameRandomizerService } from './game-randomizer.service';

@Module({
    imports: [SeedsModule],
    providers: [GameRandomizerService],
    exports: [GameRandomizerService],
})
export class GameRandomizerModule {}
