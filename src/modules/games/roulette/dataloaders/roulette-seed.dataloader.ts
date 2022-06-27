import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import { Repository } from 'typeorm';
import { RouletteSeedEntity } from '../entities/roulette-seed.entity';

@Injectable()
export class RouletteSeedDataloader extends DataLoader<
    number,
    RouletteSeedEntity
> {
    constructor(
        @InjectRepository(RouletteSeedEntity)
        private readonly rouletteSeedRepository: Repository<RouletteSeedEntity>,
    ) {
        super(async (rollIds) => {
            const seeds: (RouletteSeedEntity & { rollId: string })[] =
                await this.rouletteSeedRepository
                    .createQueryBuilder('seed')
                    .select('seed.*')
                    .addSelect('rolls.id', 'rollId')
                    .innerJoin('seed.rolls', 'rolls')
                    .where('rolls.id IN (:...rollIds)', { rollIds })
                    .getRawMany();

            const seedsByRoll = Object.fromEntries(
                seeds.map((seed) => [seed.rollId, seed] as const),
            );

            return rollIds.map((rollId) => seedsByRoll[rollId]);
        });
    }
}
