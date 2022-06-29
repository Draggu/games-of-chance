import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { Ownership } from 'directives/auth/decorators/ownership.decorator';
import { Dataloader } from 'infrastructure/dataloader/dataloader.decorator';
import { UserEntity } from 'modules/user/entities/user.entity';
import { TokenDataloader } from '../dataloaders/token.dataloader';
import { UserToken } from '../entites/auth-token.entity';

@Resolver(() => UserEntity)
export class UserTokenFieldsResolver {
    @ResolveField(() => [UserToken])
    @Ownership('id')
    tokens(
        @Parent() user: UserEntity,
        @Dataloader() tokenDataloader: TokenDataloader,
    ): Promise<UserToken[]> {
        return tokenDataloader.load(user.id);
    }
}
