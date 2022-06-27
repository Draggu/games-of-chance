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
import { RouletteBetEnhancerResolver } from './resolvers-enhancers/roulette.bet-enhancer.resolver';
import { RouletteRollEnhancerResolver } from './resolvers-enhancers/roulette.roll-enhancer.resolver';
import { RouletteSeedEnhancerResolver } from './resolvers-enhancers/roulette.seed-enhancer.resolver';
import { RouletteUserEnhancerResolver } from './resolvers-enhancers/roulette.user-enhancer.resolver';
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
        RouletteUserEnhancerResolver,
        RouletteBetEnhancerResolver,
        RouletteRollEnhancerResolver,
        RouletteSeedEnhancerResolver,
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
