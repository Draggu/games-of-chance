import { DynamicModule, Global, InjectionToken, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import Redlock from 'redlock';

@Global()
@Module({
    providers: [
        RedisCoreModule.createProvider(Redis),
        {
            provide: Redlock,
            inject: [Redis],
            useFactory: (redis: Redis) => new Redlock([redis], {}),
        },
    ],
    exports: [Redis, Redlock],
})
class RedisCoreModule {
    static createProvider(token: InjectionToken) {
        return {
            provide: token,
            inject: [ConfigService],
            useFactory: (config: ConfigService) =>
                new Redis(config.getOrThrow('REDIS_URL')),
        };
    }
}

@Module({
    imports: [RedisCoreModule],
})
export class RedisModule {
    static forFeature(token: InjectionToken): DynamicModule {
        return {
            module: RedisModule,
            providers: [RedisCoreModule.createProvider(token)],
            exports: [token],
        };
    }
}
