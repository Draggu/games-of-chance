import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDbModule } from 'helpers/test/test-db.module';
import { UserEntity } from 'modules/user/entities/user.entity';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let testingModule: TestingModule;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            imports: [TestDbModule(), TypeOrmModule.forFeature([UserEntity])],
            providers: [AuthService],
        }).compile();

        service = testingModule.get<AuthService>(AuthService);
    });

    afterAll(() => testingModule.close());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
