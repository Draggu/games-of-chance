import { Test, TestingModule } from '@nestjs/testing';
import { DiceResolver } from './dice.resolver';
import { DiceService } from './dice.service';

describe('DiceResolver', () => {
    let resolver: DiceResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [DiceResolver, DiceService],
        }).compile();

        resolver = module.get<DiceResolver>(DiceResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
