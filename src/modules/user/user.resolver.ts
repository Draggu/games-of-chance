import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth, CurrentUser } from 'directives/auth/current-user.decorator';
import { UpdateUserInput } from './dto/update-user.input';
import { UserEntity } from './entities/user.entity';
import { UserService } from './services/user.service';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserEntity)
    findUser(
        @Auth() currentUser: CurrentUser,
        @Args('id', { type: () => ID, nullable: true }) id?: string | null,
    ): Promise<UserEntity> {
        return this.userService.findById(id || currentUser.id);
    }

    @Mutation(() => UserEntity)
    updateUser(
        @Auth() currentUser: CurrentUser,
        @Args('updateUser') updateUserInput: UpdateUserInput,
    ): Promise<UserEntity> {
        return this.userService.update(currentUser, updateUserInput);
    }
}
