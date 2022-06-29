import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Auth } from 'directives/auth/decorators/current-user.decorator';
import { CurrentUser } from 'directives/auth/types';
import { DiceSeedEntity } from '../entities/dice-seed.entity';
import { DiceSeedService } from '../services/dice-seed.service';

@Resolver()
export class DiceSeedResolver {
    constructor(private readonly diceSeedService: DiceSeedService) {}

    @Mutation(() => DiceSeedEntity)
    updateDiceSeed(
        @Auth() currentUser: CurrentUser,
        @Args('newSeed') newSeed: string,
    ): Promise<DiceSeedEntity> {
        return this.diceSeedService.updateSeed(currentUser, newSeed);
    }
}
