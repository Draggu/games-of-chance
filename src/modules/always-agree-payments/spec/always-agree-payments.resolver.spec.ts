import { Test, TestingModule } from '@nestjs/testing';
import { AlwaysAgreePaymentsResolver } from '../always-agree-payments.resolver';
import { AlwaysAgreePaymentsService } from '../always-agree-payments.service';

describe('AlwaysAgreePaymentsResolver', () => {
    let resolver: AlwaysAgreePaymentsResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AlwaysAgreePaymentsResolver,
                AlwaysAgreePaymentsService,
            ],
        }).compile();

        resolver = module.get<AlwaysAgreePaymentsResolver>(
            AlwaysAgreePaymentsResolver,
        );
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
