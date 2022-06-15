import { DynamicModule, InjectionToken, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronModule } from 'infrastructure/cron/cron.module';
import { RedisModule } from 'infrastructure/redis/redis.module';
import { KeyKind } from './consts';
import { RandomKeyEntity } from './enitities/random-key.entity';
import { KeysManagerService } from './keys-manager.service';

@Module({
    imports: [
        RedisModule,
        CronModule,
        TypeOrmModule.forFeature([RandomKeyEntity]),
    ],
    providers: [KeysManagerService],
    exports: [KeysManagerService],
})
export class KeysModule {
    static forFeature({
        keyType,
        token,
    }: {
        keyType: KeyKind;
        token: InjectionToken;
    }): DynamicModule {
        return {
            module: KeysModule,
            providers: [
                {
                    provide: token,
                    inject: [KeysManagerService],
                    useFactory: (keysManager: KeysManagerService) =>
                        keysManager.get(keyType),
                },
            ],
            exports: [token],
        };
    }
}
