import { Injectable } from '@nestjs/common';
import { EntityByUserPaginatedDataloader } from 'common/dataloaders/entity-by-user-paginated.dataloader';
import { DiceRollEntity } from '../entities/dice-roll.entity';

@Injectable()
export class DiceRollDataloader extends EntityByUserPaginatedDataloader(
    DiceRollEntity,
    {
        alias: 'roll',
        userId: 'userId',
        orderBy: {
            column: 'createdAt',
            order: 'ASC',
        },
    },
) {}
