import { Controller, Get, Query } from '@nestjs/common';
import { PageInput } from 'common/dto/page';
import { DisableAuth } from 'decorators/disable-auth.decorator';
import { SeedsService } from './seeds.service';

@Controller('seeds')
export class SeedsController {
    constructor(private readonly seedsService: SeedsService) {}

    @Get()
    @DisableAuth()
    seedsHistory(@Query() page: PageInput) {
        return this.seedsService.findSeeds(page);
    }
}
