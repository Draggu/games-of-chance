import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Ownership } from 'directives/auth/decorators/ownership.decorator';
import { Dataloader } from 'infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/user/entities/user.entity';
import { DiceRollDataloader } from '../dataloaders/dice-roll.dataloader';
import { DiceSeedDataloader } from '../dataloaders/dice-seed.dataloader';
import { DiceRollEntity } from '../entities/dice-roll.entity';
import { DiceSeedEntity } from '../entities/dice-seed.entity';

@Resolver(() => UserEntity)
export class UserDiceFieldsResolver {
    @ResolveField(() => [DiceRollEntity])
    diceRolls(
        @Parent() user: UserEntity,
        @Dataloader() diceRollDataloader: DiceRollDataloader,
        @Args('page') page: PageInput,
    ) {
        return diceRollDataloader.load({
            page,
            userId: user.id,
        });
    }

    @ResolveField(() => DiceSeedEntity)
    @Ownership('id')
    diceSeed(
        @Parent() user: UserEntity,
        @Dataloader() diceSeedDataloader: DiceSeedDataloader,
    ): Promise<DiceSeedEntity> {
        return diceSeedDataloader.load(user.id);
    }
}
