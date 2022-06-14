import { Module } from '@nestjs/common';
import { RedisModule } from 'infrastructure/redis/redis.module';
import {
    PubSubService,
    REDIS_PUBLISHER,
    REDIS_SUBSCRIBER,
} from './pub-sub.service';

@Module({
    imports: [
        RedisModule.forFeature(REDIS_PUBLISHER),
        RedisModule.forFeature(REDIS_SUBSCRIBER),
    ],
    providers: [PubSubService],
    exports: [PubSubService],
})
export class PubSubModule {}
