import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import * as assert from 'assert';
import { Auth } from 'directives/auth/decorators/current-user.decorator';
import { CurrentUser } from 'directives/auth/types';
import { UpdateUserInput } from '../dto/update-user.input';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

const findUserErrMsg =
    'either there must be specified id or you must be authenticated';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserEntity, {
        description: findUserErrMsg,
    })
    findUser(
        @Auth({
            optional: true,
        })
        currentUser?: CurrentUser,
        @Args('id', { name: 'id', type: () => ID, nullable: true })
        maybeId?: string | null,
    ): Promise<UserEntity> {
        const id = maybeId || currentUser?.id;

        assert(id, findUserErrMsg);

        return this.userService.findById(id);
    }

    @Mutation(() => UserEntity)
    updateUser(
        @Auth() currentUser: CurrentUser,
        @Args('updateUser') updateUserInput: UpdateUserInput,
    ): Promise<UserEntity> {
        return this.userService.update(currentUser, updateUserInput);
    }
}
