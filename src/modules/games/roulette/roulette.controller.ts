import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PageInput } from 'common/dto/page';
import { CurrentUser } from 'decorators/current-user.decorator';
import { PlaceBetInput } from './dto/place-bet.input';
import { RouletteBetEntity } from './entities/roulette-bet.entity';
import { RouletteRollEntity } from './entities/roulette-roll.entity';
import { RouletteStatsEntity } from './entities/roulette-stats.entity';
import { RouletteService } from './services/roulette.service';

@Controller('roulette')
export class RouletteController {
    constructor(private readonly rouletteService: RouletteService) {}

    @Post('bet')
    placeBet(
        @CurrentUser() currentUser: CurrentUser,
        @Body() bet: PlaceBetInput,
    ): Promise<RouletteBetEntity> {
        return this.rouletteService.placeBet(currentUser, bet);
    }

    @Get('stats')
    rouletteStats(): Promise<RouletteStatsEntity> {
        return this.rouletteService.rouletteStats();
    }

    @Get('history')
    rouletteHistory(@Query() page: PageInput): Promise<RouletteRollEntity[]> {
        return this.rouletteService.roulleteHistory(page);
    }
}
