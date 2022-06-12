import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserEntity } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';

@Resolver(() => UserEntity)
export class UserResolver {
    constructor(private readonly userService: UserService) {}

    @Query(() => UserEntity)
    findOne(@Args('id', { type: () => ID }) id: string) {
        return this.userService.findById(id);
    }

    @Mutation(() => UserEntity)
    updateUser(
        @Args('id', { type: () => ID }) id: string,
        @Args('updateUserInput') updateUserInput: UpdateUserInput,
    ) {
        return this.userService.update(id, updateUserInput);
    }
}
