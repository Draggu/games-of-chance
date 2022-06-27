import {
    Args,
    ID,
    Mutation,
    Query,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth } from 'directives/auth/decorators/current-user.decorator';
import { CurrentUser } from 'directives/auth/types';
import { BalanceDirective } from 'directives/balance/balance-directive.decorator';
import { PubSubService } from 'infrastructure/pub-sub/pub-sub.service';
import { PlaceRouletteBetInput } from '../dto/place-bet.input';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteSeedEntity } from '../entities/roulette-seed.entity';
import { RouletteStatsEntity } from '../entities/roulette-stats.entity';
import { RouletteService } from '../services/roulette.service';

@Resolver()
export class RouletteResolver {
    constructor(
        private readonly rouletteService: RouletteService,
        private readonly pubSubService: PubSubService,
    ) {}

    @Subscription(() => ID)
    onRouletteRoll(): AsyncIterator<{ onRouletteRoll: number }> {
        return this.pubSubService.asyncIterator('onRouletteRoll');
    }

    @Subscription(() => RouletteRollEntity)
    onRouletteResults(): AsyncIterator<{
        onRouletteResults: RouletteRollEntity;
    }> {
        return this.pubSubService.asyncIterator('onRouletteResults');
    }

    @BalanceDirective()
    @Mutation(() => RouletteBetEntity, {
        nullable: true,
        description: 'returns null if game is currently running',
    })
    placeRouletteBet(
        @Auth() currentUser: CurrentUser,
        @Args('bet') bet: PlaceRouletteBetInput,
    ): Promise<RouletteBetEntity | null> {
        return this.rouletteService.placeBet(currentUser, bet);
    }

    @Query(() => RouletteStatsEntity)
    rouletteStats(): Promise<RouletteStatsEntity> {
        return this.rouletteService.rouletteStats();
    }

    @Query(() => [RouletteRollEntity])
    rouletteRollHistory(
        @Args('page') page: PageInput,
    ): Promise<RouletteRollEntity[]> {
        return this.rouletteService.roulleteHistory(page);
    }

    @Query(() => [RouletteSeedEntity])
    rouletteSeedsHistory(
        @Args('page') page: PageInput,
    ): Promise<RouletteSeedEntity[]> {
        return this.rouletteService.seedsHistory(page);
    }
}
