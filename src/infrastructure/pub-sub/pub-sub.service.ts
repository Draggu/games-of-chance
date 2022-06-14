import { Inject, Injectable } from '@nestjs/common';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import Redis from 'ioredis';
import { from } from 'rxjs';

export const REDIS_PUBLISHER = 'REDIS_PUBLISHER';
export const REDIS_SUBSCRIBER = 'REDIS_SUBSCRIBER';

interface Subscriptions {}

@Injectable()
export class PubSubService {
    private readonly messageEvent = 'message';
    private pubsub: RedisPubSub;

    constructor(
        @Inject(REDIS_PUBLISHER) readonly publisher: Redis,
        @Inject(REDIS_SUBSCRIBER) readonly subscriber: Redis,
    ) {
        this.pubsub = new RedisPubSub({
            publisher,
            subscriber,
            messageEventName: this.messageEvent,
        });
    }

    publish<T extends keyof Subscriptions>(
        event: T,
        payload: Subscriptions[T],
    ) {
        return this.pubsub.publish(event, {
            [event]: payload,
        });
    }
    /**
     * publishes only to local subscribers
     */
    publishLocal<T extends keyof Subscriptions>(
        event: T,
        payload: Subscriptions[T],
    ) {
        return this.pubsub.getSubscriber().emit(this.messageEvent, event, {
            [event]: payload,
        });
    }

    asyncIterator<T extends keyof Subscriptions>(
        triggers: T | T[],
    ): AsyncIterator<Subscriptions[T], unknown, undefined> {
        return this.pubsub.asyncIterator(triggers);
    }

    observable<T extends keyof Subscriptions>(triggers: T | T[]) {
        return from({
            [Symbol.asyncIterator]: () => this.asyncIterator(triggers),
        });
    }
}
