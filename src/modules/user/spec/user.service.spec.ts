import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { TestDbModule } from 'helpers/test/test-db.module';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../user.service';

describe('UserService', () => {
    let service: UserService;
    let testingModule: TestingModule;
    let dataSource: DataSource;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            imports: [TestDbModule, TypeOrmModule.forFeature([UserEntity])],
            providers: [UserService],
        }).compile();

        service = testingModule.get<UserService>(UserService);
        dataSource = testingModule.get<DataSource>(DataSource);
    });

    afterAll(() => testingModule.close());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create user', async () => {
        const params = {
            email: 'test@test.com',
            name: 'jeff',
        };
        const password = '67te8igwsei';

        const user = await service.create({ ...params, password });

        expect(user).toEqual(expect.objectContaining(params));

        expect(await compare(password, user.password)).toBeTruthy();
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

        const newBalance = await service.deposit(jeff, depositAmount);

        expect(newBalance).toBe(jeff.balance + depositAmount);
    });

    it('should withdraw specified amount', async () => {
        await dataSource.getRepository(UserEntity).save([jeff, tom]);

        const withdrawAmount = 782;

        const newBalance = await service.withdraw(jeff, withdrawAmount);

        expect(newBalance).toBe(jeff.balance + withdrawAmount);
    });

    it('should fail on withdrawing more than current balance', async () => {
        await dataSource.getRepository(UserEntity).save([jeff, tom]);

        const withdrawAmount = jeff.balance + 1;

        expect(() => service.withdraw(jeff, withdrawAmount)).toThrow();
    });
});
