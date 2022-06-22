import { Module } from '@nestjs/common';
import { DiceModule } from './dice/dice.module';
import { RouletteModule } from './roulette/roulette.module';

@Module({ imports: [RouletteModule, DiceModule] })
export class GamesModule {}
