import { GameRandomizerService } from 'modules/game-randomizer/game-randomizer.service';
import { UserEntity } from 'modules/user/entities/user.entity';
import {
    DataSource,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
} from 'typeorm';
import { DiceSeedEntity } from '../entities/dice-seed.entity';

@EventSubscriber()
export class DiceSeedSubscriber
    implements EntitySubscriberInterface<UserEntity>
{
    constructor(
        private readonly gameRandomizerService: GameRandomizerService,
        dataSource: DataSource,
    ) {
        dataSource.subscribers.push(this);
    }

    listenTo() {
        return UserEntity;
    }

    afterInsert({ entity, manager }: InsertEvent<UserEntity>) {
        const clientSeed = this.gameRandomizerService.generateKey();
        const serverSeed = this.gameRandomizerService.generateKey();
        const nextServerSeed = this.gameRandomizerService.generateKey();

        return manager.insert(DiceSeedEntity, {
            user: entity,
            clientSeed,
            serverSeed,
            nextServerSeed,
        });
    }
}
