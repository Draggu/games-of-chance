import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { compare } from 'bcrypt';
import { TestDbModule } from 'helpers/test/test-db.module';
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { UserService } from '../services/user.service';

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
});
