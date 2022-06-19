import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { PlaceBetInput } from './dto/place-bet.input';
import { RouletteBetEntity } from './entities/roulette-bet.entity';
import { RouletteRollEntity } from './entities/roulette-roll.entity';
import { RouletteStatsEntity } from './entities/roulette-stats.entity';
import { RouletteService } from './services/roulette.service';

@Resolver()
export class RouletteResolver {
    constructor(private readonly rouletteService: RouletteService) {}

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
    rouletteHistory(
        @Args('page', { defaultValue: {} }) page: PageInput,
    ): Promise<RouletteRollEntity[]> {
        return this.rouletteService.roulleteHistory(page);
    }
}
