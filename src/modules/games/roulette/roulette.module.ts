import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronModule } from 'infrastructure/cron/cron.module';
import { PubSubModule } from 'infrastructure/pub-sub/pub-sub.module';
import { GameRandomizerModule } from 'modules/game-randomizer/game-randomizer.module';
import { UserModule } from 'modules/user/user.module';
import { RouletteBetEntity } from './entities/roulette-bet.entity';
import { RouletteRollEntity } from './entities/roulette-roll.entity';
import { RouletteStatsEntity } from './entities/roulette-stats.entity';
import { RouletteController } from './roulette.controller';
import { RouletteResolver } from './roulette.resolver';
import { RouletteCommonService } from './services/roulette-common.service';
import { RouletteSchedulerService } from './services/roulette-scheduler.service';
import { RouletteService } from './services/roulette.service';
import { BetSubscriber } from './subscribers/bet.subscriber';
import { RollSubscriber } from './subscribers/roll.subscriber';

@Module({
    imports: [
        CronModule,
        GameRandomizerModule,
        PubSubModule,
        UserModule,
        TypeOrmModule.forFeature([
            RouletteBetEntity,
            RouletteRollEntity,
            RouletteStatsEntity,
        ]),
    ],
    providers: [
        RouletteResolver,
        RouletteService,
        RouletteSchedulerService,
        RouletteCommonService,
        BetSubscriber,
        RollSubscriber,
    ],
    controllers: [RouletteController],
})
export class RouletteModule {}
