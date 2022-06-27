import { Injectable } from '@nestjs/common';
import { EntityByUserPaginatedDataloader } from 'common/dataloaders/entity-by-user-paginated.dataloader';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';

@Injectable()
export class RouletteBetsDataloader extends EntityByUserPaginatedDataloader(
    RouletteBetEntity,
    {
        alias: 'bet',
        userId: 'userId',
        orderBy: {
            column: 'id',
            order: 'DESC',
        },
    },
) {}
