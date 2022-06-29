import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronModule } from 'infrastructure/cron/cron.module';
import { PubSubModule } from 'infrastructure/pub-sub/pub-sub.module';
import { GameRandomizerModule } from 'modules/game-randomizer/game-randomizer.module';
import { UserModule } from 'modules/user/user.module';
import { RouletteBetEntity } from './entities/roulette-bet.entity';
import { RouletteRollEntity } from './entities/roulette-roll.entity';
import { RouletteSeedEntity } from './entities/roulette-seed.entity';
import { RouletteStatsEntity } from './entities/roulette-stats.entity';
import { RouletteBetRollFieldsResolver } from './fields-resolvers/roulette-bet-roll-fields.resolver';
import { RouletteRollSeedFieldsResolver } from './fields-resolvers/roulette-roll-seed-fields.resolver';
import { RouletteSeedFieldsResolver } from './fields-resolvers/roulette-seed-fields.resolver';
import { UserRouletteFieldsResolver } from './fields-resolvers/user-roulette-fields.resolver';
import { RouletteResolver } from './resolvers/roulette.resolver';
import { RouletteGameResultsScheduler } from './schedulers/game-results.scheduler';
import { RouletteSeedScheduler } from './schedulers/game-seed.scheduler';
import { RouletteGameStartScheduler } from './schedulers/game-start.scheduler';
import { RouletteTimesService } from './services/roulette-times.service';
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
            RouletteSeedEntity,
        ]),
    ],
    providers: [
        RouletteResolver,
        UserRouletteFieldsResolver,
        RouletteBetRollFieldsResolver,
        RouletteRollSeedFieldsResolver,
        RouletteSeedFieldsResolver,
        RouletteService,
        RouletteTimesService,
        RouletteGameResultsScheduler,
        RouletteGameStartScheduler,
        RouletteSeedScheduler,
        BetSubscriber,
        RollSubscriber,
    ],
})
export class RouletteModule {}
