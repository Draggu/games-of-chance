import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { GameRandomizerService } from 'modules/game-randomizer/game-randomizer.service';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/user.service';
import { Repository } from 'typeorm';
import { DiceRollSide, unreachableChances } from './consts';
import { DiceRollInput } from './dto/dice-roll.input';
import { DiceRollEntity } from './entities/dice-roll.entity';
import { DiceSeedEntity } from './entities/dice-seed.entity';

@Injectable()
export class DiceService {
    constructor(
        @InjectRepository(DiceSeedEntity)
        private readonly diceSeedRepository: Repository<DiceSeedEntity>,
        @InjectRepository(DiceRollEntity)
        private readonly diceRollRepository: Repository<DiceRollEntity>,
        private readonly gameRandomizerService: GameRandomizerService,
        private readonly userService: UserService,
    ) {}

    rollDice(
        currentUser: CurrentUser,
        { amount, chances, side }: DiceRollInput,
    ) {
        return this.diceSeedRepository.manager.transaction(async (manager) => {
            // charge user account to lock cash for potential lose
            // also checks if user have enough to play
            await this.userService.updateBalance(
                currentUser,
                amount,
                '-',
                manager,
            );

            const [seed, prevRoll] = await Promise.all([
                manager.findOneOrFail(DiceSeedEntity, {
                    where: {
                        user: currentUser,
                    },
                }),
                manager.findOne(DiceRollEntity, {
                    order: {
                        timestamp: 'DESC',
                    },
                    where: {
                        user: currentUser,
                    },
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
                side === DiceRollSide.LOWER ? chances > roll : chances <= roll;

            if (won) {
                const betMultiplier = (unreachableChances / chances) * 0.95;

                await this.userService.updateBalance(
                    currentUser,
                    amount * betMultiplier,
                    '+',
                    manager,
                );
            }

            return manager.save(DiceRollEntity, {
                id: currentRollId,
                user: currentUser,
                winning: roll,
                seed,
                amount,
                chances,
                side,
                won,
            });
        });
    }

    getSeed(user: UserEntity) {
        return this.diceSeedRepository.findOneOrFail({
            where: {
                user,
            },
        });
    }

    updateSeed(currentUser: CurrentUser, clientSeed: string) {
        const nextServerSeed = this.gameRandomizerService.generateKey();

        return this.diceSeedRepository
            .createQueryBuilder()
            .update()
            .set({
                previousServerSeed: () => 'serverSeed',
                serverSeed: () => 'nextServerSeed',
                nextServerSeed,
                clientSeed,
            })
            .where('userId = :userId', {
                userId: currentUser.id,
            })
            .returning('*')
            .execute()
            .then(({ generatedMaps }) => generatedMaps[0] as DiceSeedEntity);
    }

    rollHistory(currentUser: CurrentUser, { skip, take }: PageInput) {
        return this.diceRollRepository.find({
            where: {
                user: currentUser,
            },
            take,
            skip: skip * take,
        });
    }
}
