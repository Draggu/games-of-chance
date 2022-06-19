import { hash } from 'bcrypt';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
} from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<UserEntity> {
    listenTo() {
        return UserEntity;
    }

    async beforeInsert({ entity }: InsertEvent<UserEntity>) {
        await this.hashPassword(entity);
    }
    async beforeUpdate({ entity }: UpdateEvent<UserEntity>) {
        await this.hashPassword(entity as Partial<UserEntity>);
    }

    private async hashPassword(entity: Partial<UserEntity>) {
        if (entity.password) {
            entity.password = await hash(entity.password, UserEntity.saltRound);
        }
    }
}
