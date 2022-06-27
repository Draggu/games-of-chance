import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Dataloader } from 'infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/user/entities/user.entity';
import { RouletteBetsDataloader } from '../dataloaders/roulette-bets.dataloader';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';

@Resolver(() => UserEntity)
export class RouletteUserEnhancerResolver {
    @ResolveField(() => [RouletteBetEntity])
    rouletteBets(
        @Parent() user: UserEntity,
        @Args('page') page: PageInput,
        @Dataloader() userBetsDataloader: RouletteBetsDataloader,
    ): Promise<RouletteBetEntity[]> {
        return userBetsDataloader.load({ userId: user.id, page });
    }
}
