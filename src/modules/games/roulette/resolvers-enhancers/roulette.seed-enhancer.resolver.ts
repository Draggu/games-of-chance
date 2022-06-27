import { Context, Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { sha256 } from 'helpers/sha256';
import { RouletteSeedEntity } from '../entities/roulette-seed.entity';

@Resolver(() => RouletteSeedEntity)
export class RouletteSeedEnhancerResolver {
    private isTooNew(seed: RouletteSeedEntity, startTime: number) {
        // for safety reasons
        // use 5 min offset before revealing seed
        const dayAndfiveMinutesAsMs = 86_700_000; // 5 * 60 * 1000 + 24 * 60 * 60 * 1000;

        return new Date(seed.day).getTime() > startTime - dayAndfiveMinutesAsMs;
    }

    // use timestamp created on query start
    // to keep consistency between isHashed and privateKey
    @ResolveField(() => Boolean)
    isHashed(
        @Parent() seed: RouletteSeedEntity,
        @Context('startTime') startTime: number,
    ): boolean {
        return this.isTooNew(seed, startTime);
    }

    @ResolveField(() => String)
    privateKey(
        @Parent() seed: RouletteSeedEntity,
        @Context('startTime') startTime: number,
    ): string {
        return this.isTooNew(seed, startTime)
            ? sha256(seed.privateKey)
            : seed.privateKey;
    }

    @ResolveField(() => Date)
    day(@Parent() seed: RouletteSeedEntity): Date {
        return new Date(seed.day);
    }
}
