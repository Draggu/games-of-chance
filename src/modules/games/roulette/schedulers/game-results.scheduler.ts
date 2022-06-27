import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronService } from 'infrastructure/cron/cron.service';
import { PubSubService } from 'infrastructure/pub-sub/pub-sub.service';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserBalanceService } from 'modules/user/services/user-balance.service';
import { DataSource, Repository } from 'typeorm';
import { RouletteBetColor, RouletteBetColorDbName } from '../consts';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteTimesService } from '../services/roulette-times.service';
import { RouletteService } from '../services/roulette.service';

@Injectable()
export class RouletteGameResultsScheduler implements OnModuleInit {
    private readonly timePlaceholder = '$1';

    constructor(
        @InjectRepository(RouletteBetEntity)
        private readonly rouletteBetRepository: Repository<RouletteBetEntity>,
        private readonly rouletteTimesService: RouletteTimesService,
        private readonly rouletteService: RouletteService,
        private readonly userBalanceService: UserBalanceService,
        private readonly cronService: CronService,
        private readonly pubSubService: PubSubService,
        private readonly dataSource: DataSource,
    ) {}

    onModuleInit() {
        const updateWinnersBalancesQuery = this.updateWinnersBalancesQuery();

        this.cronService.schedule(
            `15/${this.rouletteTimesService.roundTime} * * * * *`,
            'roulette-announce-results',
            async (done) => {
                const [lastRoll] = await this.rouletteService.roulleteHistory({
                    skip: 0,
                    take: 1,
                });

                await this.pubSubService.publish('onRouletteResults', lastRoll);

                await this.dataSource.transaction(async (manager) => {
                    await manager.query(
                        updateWinnersBalancesQuery.replace(
                            this.timePlaceholder,
                            this.rouletteTimesService.nowBackedOfIncreasedBetTime(),
                        ),
                    );

                    await done();
                });
            },
        );
    }

    private updateWinnersBalancesQuery() {
        const userTableName = this.dataSource.getMetadata(UserEntity).tableName;
        const betTableName =
            this.dataSource.getMetadata(RouletteBetEntity).tableName;

        const updateBalanceQuery = this.userBalanceService
            .updateBalanceParamLessQuery(
                '+',
                `(bets.amount * 
                (
                    CASE
                        WHEN bets.color = '${RouletteBetColor.GREEN}'::"${RouletteBetColorDbName}"
                        THEN 14
                        ELSE 2
                    END
                )
            )`,
            )
            .getQuery();

        const markBetRewardedQuery = this.rouletteBetRepository
            .createQueryBuilder()
            .update({
                isRewarded: () => 'true',
            })
            .getQuery();

        const betsTableQuery = this.rouletteBetRepository
            .createQueryBuilder('bet')
            .select([
                'bet.amount as amount',
                'bet.id as "betId"',
                'bet.userId as "userId"',
                'roll.color as color',
            ])
            .innerJoin('bet.roll', 'roll')
            .where(`"createdAt" <= ${this.timePlaceholder}`)
            .andWhere('"isRewarded" = false')
            .andWhere('bet.color = roll.color')
            .orderBy('"createdAt"', 'DESC')
            .setLock('pessimistic_partial_write')
            .getQuery();

        return `
            CREATE TEMP TABLE "bets"
            ON COMMIT DROP AS
            ${betsTableQuery};

            ${updateBalanceQuery}
            FROM bets
            WHERE "${userTableName}".id = "userId";

            ${markBetRewardedQuery}
            FROM bets
            WHERE "${betTableName}".id = "betId";
        `;
    }
}
