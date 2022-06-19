import { Test, TestingModule } from '@nestjs/testing';
import { RouletteSchedulerService } from '../roulette-scheduler.service';

describe('RouletteSchedulerService', () => {
    let service: RouletteSchedulerService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RouletteSchedulerService],
        }).compile();

        service = module.get<RouletteSchedulerService>(
            RouletteSchedulerService,
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
