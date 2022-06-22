import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { RouletteBetColor } from '../consts';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteStatsEntity } from '../entities/roulette-stats.entity';

@EventSubscriber()
export class RollSubscriber
    implements EntitySubscriberInterface<RouletteRollEntity>
{
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return RouletteRollEntity;
    }

    afterInsert(event: InsertEvent<RouletteRollEntity>) {
        const color: RouletteBetColor = event.metadata.propertiesMap.color;
        const updateColumnName: keyof RouletteStatsEntity =
            color === RouletteBetColor.GREEN
                ? 'greenCount'
                : color === RouletteBetColor.RED
                ? 'redCount'
                : 'blackCount';

        return event.manager.increment(
            RouletteStatsEntity,
            {
                id: 1,
            },
            updateColumnName,
            1,
        );
    }
}
