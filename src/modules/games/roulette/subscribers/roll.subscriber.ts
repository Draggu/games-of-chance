import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { BetColor } from '../consts';
import { RouletteRollEntity } from '../entities/roulette-roll.entity';
import { RouletteStatsEntity } from '../entities/roulette-stats.entity';

@EventSubscriber()
export class RollSubscriber
    implements EntitySubscriberInterface<RouletteRollEntity>
{
    listenTo() {
        return RouletteRollEntity;
    }

    afterInsert(event: InsertEvent<RouletteRollEntity>) {
        const color: BetColor = event.metadata.propertiesMap.color;
        const updateColumnName: keyof RouletteStatsEntity =
            color === BetColor.GREEN
                ? 'greenCount'
                : color === BetColor.RED
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
