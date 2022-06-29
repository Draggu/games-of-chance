import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
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

            const seedsByUser = _.keyBy(seeds, 'userId');

            return userIds.map((userId) => seedsByUser[userId]);
        });
    }
}
