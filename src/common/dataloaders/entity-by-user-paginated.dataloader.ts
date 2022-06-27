import { mixin, Type } from '@nestjs/common';
import { PageInput } from 'common/dto/page';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import { DataSource } from 'typeorm';

export const EntityByUserPaginatedDataloader = <T>(
    entity: Type<T>,
    {
        userId,
        alias,
        orderBy,
    }: {
        userId: keyof T;
        alias: string;
        orderBy: { column: keyof T; order: 'DESC' | 'ASC' };
    },
) =>
    mixin(
        class extends DataLoader<
            { userId: string; page: PageInput },
            T[],
            string
        > {
            constructor(readonly dataSource: DataSource) {
                super(
                    async (keys) => {
                        const qb = this.dataSource
                            .createQueryBuilder()
                            .select('*')
                            .from<T>(
                                (qb) =>
                                    qb
                                        .select('*')
                                        .from(entity, alias)
                                        .addSelect(
                                            `
                                        RANK() over (
                                            PARTITION BY ${alias}."${
                                                userId as string
                                            }"
                                            ORDER BY ${alias}."${
                                                orderBy.column as string
                                            }" ${orderBy.order}
                                        ) as "R"
                                        `,
                                        )
                                        .addSelect(
                                            `"${
                                                userId as string
                                            }" as "user_id"`,
                                        ),
                                `${alias}s_with_rank`,
                            );

                        keys.forEach(({ userId, page: { skip, take } }) => {
                            qb.orWhere(
                                `(
                                ${alias}s_with_rank.user_id = :userId
                                    AND
                                ${alias}s_with_rank."R" > :skip
                                    AND
                                ${alias}s_with_rank."R" <= :take
                                )`,
                                {
                                    userId,
                                    skip,
                                    take: take + take * skip,
                                },
                            );
                        });

                        const entities = await qb.getRawMany<T>();
                        const entitiesByUserId = _.groupBy(
                            entities,
                            (entity) => entity[userId],
                        );

                        return keys.map(
                            (keys) => entitiesByUserId[keys.userId] || [],
                        );
                    },
                    {
                        cacheKeyFn: ({ userId, page: { skip, take } }) =>
                            `${userId}${skip}${take}`,
                    },
                );
            }
        },
    );
