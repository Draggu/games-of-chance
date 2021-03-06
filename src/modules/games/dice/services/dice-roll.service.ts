import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'directives/auth/types';
import { GameRandomizerService } from 'modules/game-randomizer/services/game-randomizer.service';
import { UserBalanceService } from 'modules/user/services/user-balance.service';
import { Repository } from 'typeorm';
import { DiceRollSide, unreachableChances } from '../consts';
import { DiceRollInput } from '../dto/dice-roll.input';
import { DiceRollEntity } from '../entities/dice-roll.entity';
import { DiceSeedEntity } from '../entities/dice-seed.entity';

@Injectable()
export class DiceRollService {
    constructor(
        @InjectRepository(DiceRollEntity)
        private readonly diceRollRepository: Repository<DiceRollEntity>,
        private readonly gameRandomizerService: GameRandomizerService,
        private readonly userBalanceService: UserBalanceService,
    ) {}

    rollDice(
        currentUser: CurrentUser,
        { amount, chances, side }: DiceRollInput,
    ) {
        return this.diceRollRepository.manager.transaction(async (manager) => {
            // charge user account to lock cash for potential lose
            // also checks if user have enough to play
            await this.userBalanceService.updateBalance(
                currentUser,
                amount,
                '-',
                manager,
            );

            // safe because all queries are SELECT ones
            const [seed, prevRoll] = await Promise.all([
                manager.findOneOrFail(DiceSeedEntity, {
                    where: {
                        user: currentUser,
                    },
                }),
                manager.findOne(DiceRollEntity, {
                    order: {
                        createdAt: 'DESC',
                    },
                    where: {},
                }),
            ]);

            const currentRollId = prevRoll ? prevRoll.id + 1 : 1;

            const { roll } = this.gameRandomizerService.result({
                privateKey: seed.serverSeed,
                publicKey: seed.clientSeed,
                range: unreachableChances,
                nonce: currentRollId,
            });

            const won =
                side === DiceRollSide.LOWER
                    ? chances > roll
                    : unreachableChances - chances <= roll;

            if (won) {
                const betMultiplier = (unreachableChances / chances) * 0.95;

                await this.userBalanceService.updateBalance(
                    currentUser,
                    Math.floor(amount * betMultiplier),
                    '+',
                    manager,
                );
            }

            return manager
                .createQueryBuilder()
                .insert()
                .into(DiceRollEntity)
                .values({
                    id: currentRollId,
                    user: currentUser,
                    winning: roll,
                    seed,
                    amount,
                    chances,
                    side,
                    won,
                })
                .returning('*')
                .execute()
                .then(({ raw }) => raw[0]);
        });
    }

    rollHistory({ skip, take }: PageInput) {
        return this.diceRollRepository.find({
            take,
            skip: skip * take,
        });
    }
}
