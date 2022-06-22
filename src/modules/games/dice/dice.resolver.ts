import {
    Args,
    Mutation,
    Parent,
    Query,
    ResolveField,
    Resolver,
} from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { UserEntity } from 'modules/user/entities/user.entity';
import { DiceService } from './dice.service';
import { DiceRollInput } from './dto/dice-roll.input';
import { DiceRollEntity } from './entities/dice-roll.entity';
import { DiceSeedEntity } from './entities/dice-seed.entity';

@Resolver(() => UserEntity)
export class DiceSeedResolver {
    constructor(private readonly diceService: DiceService) {}

    @ResolveField(() => DiceSeedEntity)
    diceSeed(@Parent() user: UserEntity): Promise<DiceSeedEntity> {
        return this.diceService.getSeed(user);
    }
}

@Resolver(() => DiceRollEntity)
export class DiceResolver {
    constructor(private readonly diceService: DiceService) {}

    @Mutation(() => DiceRollEntity)
    rollDice(
        @CurrentUser() currentUser: CurrentUser,
        @Args('createDiceInput') createDiceInput: DiceRollInput,
    ): Promise<DiceRollEntity> {
        return this.diceService.rollDice(currentUser, createDiceInput);
    }

    @Mutation(() => DiceSeedEntity)
    updateDiceSeed(
        @CurrentUser() currentUser: CurrentUser,
        @Args('newSeed') newSeed: string,
    ): Promise<DiceSeedEntity> {
        return this.diceService.updateSeed(currentUser, newSeed);
    }

    @Query(() => [DiceRollEntity])
    diceHistory(
        @CurrentUser() currentUser: CurrentUser,
        @Args('page') page: PageInput,
    ): Promise<DiceRollEntity[]> {
        return this.diceService.rollHistory(currentUser, page);
    }
}
