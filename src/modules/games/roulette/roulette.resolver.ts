import {
    Args,
    ID,
    Mutation,
    Query,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { DisableAuth } from 'decorators/disable-auth.decorator';
import { PubSubService } from 'infrastructure/pub-sub/pub-sub.service';
import { PlaceBetInput } from './dto/place-bet.input';
import { RouletteBetEntity } from './entities/roulette-bet.entity';
import { RouletteRollEntity } from './entities/roulette-roll.entity';
import { RouletteSeedEntity } from './entities/roulette-seed.entity';
import { RouletteStatsEntity } from './entities/roulette-stats.entity';
import { RouletteService } from './services/roulette.service';

@Resolver()
export class RouletteResolver {
    constructor(
        private readonly rouletteService: RouletteService,
        private readonly pubSubService: PubSubService,
    ) {}

    @Subscription(() => ID)
    @DisableAuth()
    onRouletteRoll(): AsyncIterator<{ onRouletteRoll: number }> {
        return this.pubSubService.asyncIterator('onRouletteRoll');
    }

    @Subscription(() => RouletteRollEntity)
    @DisableAuth()
    onRouletteResults(): AsyncIterator<{
        onRouletteResults: RouletteRollEntity;
    }> {
        return this.pubSubService.asyncIterator('onRouletteResults');
    }

    @Mutation(() => RouletteBetEntity)
    placeBet(
        @CurrentUser() currentUser: CurrentUser,
        @Args('bet') bet: PlaceBetInput,
    ): Promise<RouletteBetEntity> {
        return this.rouletteService.placeBet(currentUser, bet);
    }

    @Query(() => RouletteStatsEntity)
    rouletteStats(): Promise<RouletteStatsEntity> {
        return this.rouletteService.rouletteStats();
    }

    @Query(() => [RouletteRollEntity])
    rouletteRollHistory(
        @Args('page', { defaultValue: {} }) page: PageInput,
    ): Promise<RouletteRollEntity[]> {
        return this.rouletteService.roulleteHistory(page);
    }

    @Query(() => [RouletteSeedEntity])
    @DisableAuth()
    rouletteSeedsHistory(
        @Args('page') page: PageInput,
    ): Promise<RouletteSeedEntity[]> {
        return this.rouletteService.seedsHistory(page);
    }
}
