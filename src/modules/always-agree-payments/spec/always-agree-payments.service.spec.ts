import { Test, TestingModule } from '@nestjs/testing';
import { AlwaysAgreePaymentsService } from '../always-agree-payments.service';

describe('AlwaysAgreePaymentsService', () => {
    let service: AlwaysAgreePaymentsService;
    let testingModule: TestingModule;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            providers: [AlwaysAgreePaymentsService],
        }).compile();

        service = testingModule.get<AlwaysAgreePaymentsService>(
            AlwaysAgreePaymentsService,
        );
    });

    afterAll(() => testingModule.close());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
