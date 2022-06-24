import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { Auth, CurrentUser } from 'directives/auth/current-user.decorator';
import { BalanceDirective } from 'directives/balance/balance-directive.decorator';
import { DiceRollInput } from '../dto/dice-roll.input';
import { DiceRollEntity } from '../entities/dice-roll.entity';
import { DiceRollService } from '../services/dice-roll.service';

@Resolver(() => DiceRollEntity)
export class DiceRollResolver {
    constructor(private readonly diceService: DiceRollService) {}

    @Mutation(() => DiceRollEntity)
    @BalanceDirective()
    rollDice(
        @Auth() currentUser: CurrentUser,
        @Args('createDiceInput') createDiceInput: DiceRollInput,
    ): Promise<DiceRollEntity> {
        return this.diceService.rollDice(currentUser, createDiceInput);
    }

    @Query(() => [DiceRollEntity])
    diceRollHistory(
        @Auth() currentUser: CurrentUser,
        @Args('page') page: PageInput,
        @Args('onlyOwn', {
            defaultValue: false,
        })
        onlyOwn: boolean,
    ): Promise<DiceRollEntity[]> {
        return this.diceService.rollHistory(currentUser, page, onlyOwn);
    }
}
