import {
    Args,
    ID,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
    Subscription,
} from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth, CurrentUser } from 'directives/auth/current-user.decorator';
import { BalanceDirective } from 'directives/balance/balance-directive.decorator';
import { PubSubService } from 'infrastructure/pub-sub/pub-sub.service';
import { PlaceRouletteBetInput } from './dto/place-bet.input';
import { RouletteBetEntity } from './entities/roulette-bet.entity';
import { RouletteRollEntity } from './entities/roulette-roll.entity';
import { RouletteSeedEntity } from './entities/roulette-seed.entity';
import { RouletteStatsEntity } from './entities/roulette-stats.entity';
import { RouletteService } from './services/roulette.service';

@Resolver(() => RouletteSeedEntity)
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

    @Mutation(() => RouletteBetEntity)
    @BalanceDirective()
    placeRouletteBet(
        @Auth() currentUser: CurrentUser,
        @Args('bet') bet: PlaceRouletteBetInput,
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
    rouletteSeedsHistory(
        @Args('page') page: PageInput,
    ): Promise<RouletteSeedEntity[]> {
        return this.rouletteService.seedsHistory(page);
    }

    @ResolveField(() => Boolean)
    isHashed(
        @Parent() seed: RouletteSeedEntity & { isHashed?: boolean },
    ): boolean {
        return !!seed.isHashed;
    }
}
