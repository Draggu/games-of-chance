import { UserEntity } from 'modules/user/entities/user.entity';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { RouletteBetEntity } from '../entities/roulette-bet.entity';

@EventSubscriber()
export class BetSubscriber
    implements EntitySubscriberInterface<RouletteBetEntity>
{
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
