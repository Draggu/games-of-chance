import { DynamicModule, InjectionToken, Module } from '@nestjs/common';
import { RedisModule } from 'infrastructure/redis/redis.module';
import { KeyKind } from './consts';
import { SecretsManagerService } from './secrets-manager.service';

@Module({
    imports: [RedisModule],
    providers: [SecretsManagerService],
    exports: [SecretsManagerService],
})
export class SecretKeysModule {
    static forFeature({
        keyType,
        token,
    }: {
        keyType: KeyKind;
        token: InjectionToken;
    }): DynamicModule {
        return {
            module: SecretKeysModule,
            providers: [
                {
                    provide: token,
                    inject: [SecretsManagerService],
                    useFactory: (secretManager: SecretsManagerService) =>
                        secretManager.getOwner(keyType),
                },
            ],
            exports: [token],
        };
    }
}
