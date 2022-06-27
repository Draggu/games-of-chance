import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { In, Repository } from 'typeorm';
import { DiceSeedEntity } from '../entities/dice-seed.entity';

@Injectable()
export class DiceSeedDataloader extends DataLoader<string, DiceSeedEntity> {
    constructor(
        @InjectRepository(DiceSeedEntity)
        private readonly diceSeedRepository: Repository<DiceSeedEntity>,
    ) {
        super(async (userIds) => {
            const seeds = await this.diceSeedRepository.find({
                where: {
                    userId: In(userIds as string[]),
                },
            });

            const seedsByUser = Object.fromEntries(
                seeds.map((seed) => [seed.userId, seed] as const),
            );

            return userIds.map((userId) => seedsByUser[userId]);
        });
    }
}
