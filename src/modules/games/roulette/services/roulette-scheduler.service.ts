import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CronService } from 'infrastructure/cron/cron.service';
import { GameRandomizerService } from 'modules/game-randomizer/game-randomizer.service';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/user.service';
import { DataSource, Repository } from 'typeorm';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteCommonService } from './roulette-common.service';

@Injectable()
export class RouletteSchedulerService implements OnModuleInit {
    constructor(
        @InjectRepository(RouletteBetEntity)
        private readonly rouletteBetRepository: Repository<RouletteBetEntity>,
        @InjectRepository(RouletteRollEntity)
        private readonly rouletteRollRepository: Repository<RouletteRollEntity>,
        private readonly dataSource: DataSource,
        private readonly rouletteValuesService: RouletteCommonService,
        private readonly gameRandomizerService: GameRandomizerService,
        private readonly userService: UserService,
        private readonly cronService: CronService,
    ) {}

    onModuleInit() {
        this.cronService.schedule(
            `0/${this.rouletteValuesService.roundTime} * * * * *`,
            'roulette-create-game',
            async (done) => {
                const lastRoll = await this.rouletteRollRepository.findOne({
                    select: ['id'],
                    order: {
                        timestamp: 'DESC',
                    },
                    where: {},
                });

                await this.dataSource.transaction(async (manager) => {
                    const nextId = lastRoll ? lastRoll.id + 1 : 1;
                    const { roll } = this.gameRandomizerService.result(
                        15,
                        nextId,
                    );

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
            },
        );

        const { query, paramName } = this.prepareBalanceQuery();

        this.cronService.schedule(
            `15/${this.rouletteValuesService.roundTime} * * * * *`,
            'roulette-announce-results',
            async (done) => {
                const nowDate = this.rouletteValuesService
                    .nowWithBetTime()
                    .toISOString();
                await this.dataSource.transaction((manager) =>
                    manager.query(query.replace(paramName, nowDate)).then(done),
                );
            },
        );
    }

    private prepareBalanceQuery() {
        const userTableName = this.dataSource.getMetadata(UserEntity).tableName;
        const betTableName =
            this.dataSource.getMetadata(RouletteBetEntity).tableName;
        const paramName = ':nowDate';

        const updateBalanceQuery = this.userService
            .updateBalanceParamLessQuery('+', 'bets.amount')
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
            ])
            .innerJoin('bet.roll', 'roll')
            .where(`timestamp >= '${paramName}'::Date`)
            .andWhere('"isRewarded" = false')
            .andWhere('bet.color = roll.color')
            .orderBy('timestamp', 'DESC')
            .setLock('pessimistic_partial_write')
            .getQuery();

        const query = `
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

        return {
            query,
            paramName,
        };
    }
}
