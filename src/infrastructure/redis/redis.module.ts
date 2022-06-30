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
            useFactory: async (config: ConfigService) => {
                const redis = new Redis({
                    lazyConnect: true,
                    host: config.get('REDIS_HOST'),
                    port: config.get('REDIS_PORT'),
                    password: config.get('REDIS_PASSWORD'),
                });

                await redis.connect();

                return redis;
            },
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
