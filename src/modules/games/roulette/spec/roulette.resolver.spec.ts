import { Test, TestingModule } from '@nestjs/testing';
import { RouletteResolver } from './roulette.resolver';
import { RouletteService } from './roulette.service';

describe('RouletteResolver', () => {
    let resolver: RouletteResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [RouletteResolver, RouletteService],
        }).compile();

        resolver = module.get<RouletteResolver>(RouletteResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
