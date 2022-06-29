import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Dataloader } from 'infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserDataloader } from '../dataloaders/user.dataloader';
import { DiceRollEntity } from '../entities/dice-roll.entity';

@Resolver(() => DiceRollEntity)
export class DiceRollUserFieldsResolver {
    @ResolveField(() => UserEntity)
    user(
        @Parent() roll: DiceRollEntity,
        @Dataloader() userDataloader: UserDataloader,
    ): Promise<UserEntity> {
        return userDataloader.load(roll.userId);
    }
}
