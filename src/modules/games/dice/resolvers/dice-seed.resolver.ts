import {
    Args,
    Mutation,
    Parent,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { CurrentUser } from 'decorators/current-user.decorator';
import { UserEntity } from 'modules/user/entities/user.entity';
import { DiceSeedEntity } from '../entities/dice-seed.entity';
import { DiceSeedService } from '../services/dice-seed.service';

// yes, it's intentionally UserEntity
// @ResolveField should be applied on it
@Resolver(() => UserEntity)
export class DiceSeedResolver {
    constructor(private readonly diceSeedService: DiceSeedService) {}

    @Mutation(() => DiceSeedEntity)
    updateDiceSeed(
        @CurrentUser() currentUser: CurrentUser,
        @Args('newSeed') newSeed: string,
    ): Promise<DiceSeedEntity> {
        return this.diceSeedService.updateSeed(currentUser, newSeed);
    }

    @ResolveField(() => DiceSeedEntity)
    diceSeed(@Parent() user: UserEntity): Promise<DiceSeedEntity> {
        return this.diceSeedService.getSeed(user);
    }
}
