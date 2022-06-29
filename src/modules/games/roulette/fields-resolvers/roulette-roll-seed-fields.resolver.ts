import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'infrastructure/dataloader/dataloader.decorator';
import { RouletteSeedDataloader } from '../dataloaders/roulette-seed.dataloader';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteSeedEntity } from '../entities/roulette-seed.entity';

@Resolver(() => RouletteRollEntity)
export class RouletteRollSeedFieldsResolver {
    @ResolveField(() => RouletteSeedEntity)
    seed(
        @Parent() rouletteRoll: RouletteSeedEntity,
        @Dataloader() rouletteSeedDataloader: RouletteSeedDataloader,
    ): Promise<RouletteSeedEntity> {
        return rouletteSeedDataloader.load(rouletteRoll.id);
    }
}
