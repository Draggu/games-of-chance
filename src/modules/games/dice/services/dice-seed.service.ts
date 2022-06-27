import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrentUser } from 'directives/auth/types';
import { GameRandomizerService } from 'modules/game-randomizer/services/game-randomizer.service';
import { Repository } from 'typeorm';
import { DiceSeedEntity } from '../entities/dice-seed.entity';

@Injectable()
export class DiceSeedService {
    constructor(
        @InjectRepository(DiceSeedEntity)
        private readonly diceSeedRepository: Repository<DiceSeedEntity>,
        private readonly gameRandomizerService: GameRandomizerService,
    ) {}

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
