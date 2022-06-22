import { UserEntity } from 'modules/user/entities/user.entity';
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';

@EventSubscriber()
export class BetSubscriber
    implements EntitySubscriberInterface<RouletteBetEntity>
{
    constructor(dataSource: DataSource) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return RouletteBetEntity;
    }

    beforeInsert(event: InsertEvent<RouletteBetEntity>) {
        return event.manager.decrement(
            UserEntity,
            {
                id: event.entity.userId || event.entity.user.id,
            },
            'balance',
            event.entity.amount,
        );
    }
}
