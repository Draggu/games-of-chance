import { mixin, Type } from '@nestjs/common';
import { PageInput } from 'common/dto/page';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import { DataSource } from 'typeorm';

export const EntityByUserPaginatedDataloader = <T>(
    entity: Type<T>,
    {
        userId,
        orderBy,
    }: {
        userId: keyof T & string;
        orderBy: { column: keyof T & string; order: 'DESC' | 'ASC' };
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
                                        .from(entity, 'e')
                                        .addSelect(
                                            'ROW_NUMBER() over (' +
                                                `PARTITION BY "${userId}" ` +
                                                `ORDER BY "${orderBy.column}" ${orderBy.order}` +
                                                ') as r',
                                        )
                                        .addSelect(`"${userId}" as "user_id"`),
                                '',
                            );

                        keys.forEach(({ userId, page: { skip, take } }) => {
                            qb.orWhere(
                                '(user_id = :userId AND r > :skip AND r <= :take)',
                                {
                                    userId,
                                    skip,
                                    take: take + skip,
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
                            `${userId}_${skip}_${take}`,
                    },
                );
            }
        },
    );
