import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/current-user.decorator';
import { GameRandomizerService } from 'modules/game-randomizer/game-randomizer.service';
import { UserEntity } from 'modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { DiceSeedEntity } from '../entities/dice-seed.entity';

@Injectable()
export class DiceSeedService {
    constructor(
        @InjectRepository(DiceSeedEntity)
        private readonly diceSeedRepository: Repository<DiceSeedEntity>,
        private readonly gameRandomizerService: GameRandomizerService,
    ) {}

    getSeed(user: UserEntity) {
        return this.diceSeedRepository.findOneOrFail({
            where: {
                user,
            },
        });
    }

    updateSeed(
        currentUser: CurrentUser,
        clientSeed: string,
    ): Promise<DiceSeedEntity> {
        const nextServerSeed = this.gameRandomizerService.generateKey();

        return this.diceSeedRepository
            .createQueryBuilder()
            .update()
            .set({
                previousServerSeed: () => '"serverSeed"',
                serverSeed: () => '"nextServerSeed"',
                nextServerSeed,
                clientSeed,
            })
            .where('userId = :userId', {
                userId: currentUser.id,
            })
            .returning('*')
            .execute()
            .then(({ raw }) => raw[0]);
    }
}
