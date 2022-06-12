import { Test, TestingModule } from '@nestjs/testing';
import { AlwaysAgreePaymentsController } from '../always-agree-payments.controller';

describe('AlwaysAgreePaymentsController', () => {
    let controller: AlwaysAgreePaymentsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AlwaysAgreePaymentsController],
        }).compile();

        controller = module.get<AlwaysAgreePaymentsController>(
            AlwaysAgreePaymentsController,
        );
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });
});
