import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDbModule } from 'helpers/test/test-db.module';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserBalanceService } from '../services/user-balance.service';

describe('UserBalanceService', () => {
    let service: UserBalanceService;
    let testingModule: TestingModule;
    let dataSource: DataSource;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            imports: [TestDbModule, TypeOrmModule.forFeature([UserEntity])],
            providers: [UserBalanceService],
        }).compile();

        service = testingModule.get<UserBalanceService>(UserBalanceService);
        dataSource = testingModule.get<DataSource>(DataSource);
    });

    afterAll(() => testingModule.close());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const jeff = {
        id: 'id-of-jeff',
        name: 'jeff',
        email: 'test@test.com',
        balance: 1234,
        password: 'asdjnnn',
    };

    const tom = {
        name: 'tom',
        id: 'id-of-tom',
        email: 'test2@test.com',
        password: 'tu89ioj',
    };

    it('should deposit specified amount', async () => {
        await dataSource.getRepository(UserEntity).save([jeff, tom]);

        const depositAmount = 50782;

        const newBalance = await service.updateBalance(
            jeff,
            depositAmount,
            '+',
        );

        expect(newBalance).toBe(jeff.balance + depositAmount);
    });

    it('should withdraw specified amount', async () => {
        await dataSource.getRepository(UserEntity).save([jeff, tom]);

        const withdrawAmount = 782;

        const newBalance = await service.updateBalance(
            jeff,
            withdrawAmount,
            '-',
        );

        expect(newBalance).toBe(jeff.balance + withdrawAmount);
    });

    it('should fail on withdrawing more than current balance', async () => {
        await dataSource.getRepository(UserEntity).save([jeff, tom]);

        const withdrawAmount = jeff.balance + 1;

        expect(() =>
            service.updateBalance(jeff, withdrawAmount, '-'),
        ).toThrow();
    });
});
