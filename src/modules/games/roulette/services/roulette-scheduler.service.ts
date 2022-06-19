import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronService } from 'infrastructure/cron/cron.service';
import { PubSubService } from 'infrastructure/pub-sub/pub-sub.service';
import { GameRandomizerService } from 'modules/game-randomizer/game-randomizer.service';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { RouletteBetColor, RouletteBetColorDbName } from '../consts';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteCommonService } from './roulette-common.service';
import { RouletteService } from './roulette.service';

@Injectable()
export class RouletteSchedulerService implements OnModuleInit {
    constructor(
        @InjectRepository(RouletteBetEntity)
        private readonly rouletteBetRepository: Repository<RouletteBetEntity>,
        private readonly rouletteCommonService: RouletteCommonService,
        private readonly rouletteService: RouletteService,
        private readonly gameRandomizerService: GameRandomizerService,
        private readonly userService: UserService,
        private readonly cronService: CronService,
        private readonly pubSubService: PubSubService,
        private readonly dataSource: DataSource,
    ) {}

    onModuleInit() {
        const { roundTime } = this.rouletteCommonService;

        this.cronService.schedule(
            `0/${roundTime} * * * * *`,
            'roulette-create-game',
            async (done) => {
                const timestamp = this.rouletteCommonService.nowWithBetTime(0);
                const lastRoll = await this.rouletteCommonService
                    .currentRoll()
                    .where(`timestamp >= ${timestamp}`)
                    .getOne();

                const nextId = lastRoll ? lastRoll.id + 1 : 1;
                const { roll } = this.gameRandomizerService.result(15, nextId);

                await this.dataSource.transaction(async (manager) => {
                    await manager.insert(RouletteRollEntity, {
                        id: nextId,
                        // sync roll date with date of seed used to generate id
                        seed: {
                            id: this.gameRandomizerService.seedId(),
                        },
                        winning: roll,
                    });

                    await done();
                });

                await this.pubSubService.publish('onRouletteRoll', nextId);
            },
        );

        const updateWinnersBalancesQuery = this.updateWinnersBalancesQuery();

        this.cronService.schedule(
            `15/${roundTime} * * * * *`,
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
                            '$1',
                            this.rouletteCommonService.nowWithBetTime(),
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

        const updateBalanceQuery = this.userService
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
            .where(`timestamp <= $1`)
            .andWhere('"isRewarded" = false')
            .andWhere('bet.color = roll.color')
            .orderBy('timestamp', 'DESC')
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
