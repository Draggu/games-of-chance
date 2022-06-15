import { Args, Query, Resolver } from '@nestjs/graphql';
import { PageInput } from 'common/dto/page';
import { DisableAuth } from 'decorators/disable-auth.decorator';
import { SeedEntity } from './enitities/seed.entity';
import { SeedsService } from './seeds.service';

@Resolver()
export class SeedsResolver {
    constructor(private readonly seedsService: SeedsService) {}

    @Query(() => [SeedEntity])
    @DisableAuth()
    seedsHistory(@Args('page') page: PageInput): Promise<SeedEntity[]> {
        return this.seedsService.findSeeds(page);
    }
}
