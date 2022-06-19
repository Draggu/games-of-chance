import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { DataSource, Repository } from 'typeorm';
import { PlaceBetInput } from '../dto/place-bet.input';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteStatsEntity } from '../entities/roulette-stats.entity';
import { RouletteCommonService } from './roulette-common.service';

@Injectable()
export class RouletteService implements OnModuleInit {
    constructor(
        @InjectRepository(RouletteRollEntity)
        private readonly rouletteRollRepository: Repository<RouletteRollEntity>,
        @InjectRepository(RouletteStatsEntity)
        private readonly rouletteStatsEntity: Repository<RouletteStatsEntity>,
        private readonly rouletteValuesService: RouletteCommonService,
        private readonly dataSource: DataSource,
    ) {}

    async onModuleInit() {
        await this.rouletteStatsEntity.insert({}).catch(() => {});
    }

    async placeBet(
        currentUser: CurrentUser,
        bet: PlaceBetInput,
    ): Promise<RouletteBetEntity> {
        const now = this.rouletteValuesService.nowWithBetTime().toISOString();

        const betTableName =
            this.dataSource.getMetadata(RouletteBetEntity).tableName;

        const [newestRollquery, newestRollParams] = this.rouletteRollRepository
            .createQueryBuilder()
            .select('id', 'rollId')
            .addSelect([':amount', ':color', ':userId'])
            .orderBy('timestamp', 'DESC')
            .where('timestamp >= :now')
            .take(1)
            .setParameters({
                ...bet,
                userId: currentUser.id,
                now,
            })
            .getQueryAndParameters();

        return this.dataSource.query(
            `
            INSERT INTO ${betTableName}
            ${newestRollquery}
            RETURNING *
        `,
            newestRollParams,
        );
    }

    rouletteStats() {
        return this.rouletteStatsEntity.findOneOrFail({
            where: {
                id: 1,
            },
        });
    }

    roulleteHistory({ skip, take }: PageInput) {
        return this.rouletteRollRepository.find({
            order: {
                timestamp: 'DESC',
            },
            skip,
            take,
        });
    }
}
