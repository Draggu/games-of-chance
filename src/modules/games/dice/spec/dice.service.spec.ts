import { Test, TestingModule } from '@nestjs/testing';
import { DiceRollService } from '../services/dice-roll.service';

describe('DiceService', () => {
    let service: DiceRollService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DiceRollService],
        }).compile();

        service = module.get<DiceRollService>(DiceRollService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
