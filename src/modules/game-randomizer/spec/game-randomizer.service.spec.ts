import { Test, TestingModule } from '@nestjs/testing';
import { SeedsService } from 'modules/seeds/seeds.service';
import { GameRandomizerService } from '../game-randomizer.service';

describe('GameRandomizerService', () => {
    let service: GameRandomizerService;
    let keysManager: SeedsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                GameRandomizerService,
                {
                    provide: SeedsService,
                    useValue: {
                        getPublicKey: jest.fn(
                            () =>
                                'ee39b4ceb056c1368cd71fbf628cc4d9c1c59ff403aa45a460352052d32e1c71',
                        ),
                        getPrivateKey: jest.fn(
                            () =>
                                '7be34f7e47ca8bd291e662635537ad22a82cd62a7deb5816316c4ddd85a3ec5c',
                        ),
                    },
                },
            ],
        }).compile();

        service = module.get<GameRandomizerService>(GameRandomizerService);
        keysManager = module.get<SeedsService>(SeedsService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should generate random number between 0..N', () => {
        const n = 234;
        const { roll } = service.result(n, 123234);

        expect(roll).toBeGreaterThanOrEqual(0);
        expect(roll).toBeLessThan(n);
    });

    it('should request public and private keys', () => {
        service.result(23, 123234);

        expect(keysManager.getPublicKey).toBeCalled();
        expect(keysManager.getPrivateKey).toBeCalled();
    });

    it('should be fairly unique', () => {
        const occurences: number[] = [];

        for (let i = 0; i < 10_000; i++) {
            const { roll } = service.result(10, i);

            occurences[roll] ??= 0;
            occurences[roll]++;
        }

        occurences.forEach((occurence) => {
            expect(occurence).toBeGreaterThan(950);
            expect(occurence).toBeLessThan(1050);
        });
    });

    it('should generate 8 char string', () => {
        const { key } = service.result(10, 767);

        expect(key.length).toBe(8);
    });
});
