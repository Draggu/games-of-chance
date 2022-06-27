import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'infrastructure/dataloader/dataloader.decorator';
import { RouletteRollDataloader } from '../dataloaders/roulette-roll.dataloader';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';

@Resolver(() => RouletteBetEntity)
export class RouletteBetEnhancerResolver {
    @ResolveField(() => RouletteRollEntity, {
        nullable: true,
    })
    roll(
        @Parent() rouletteBet: RouletteBetEntity,
        @Dataloader() rouletteRollDataloader: RouletteRollDataloader,
    ): Promise<RouletteRollEntity | null> {
        return rouletteRollDataloader.load(rouletteBet.id);
    }
}
