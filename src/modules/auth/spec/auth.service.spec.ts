import { Test, TestingModule } from '@nestjs/testing';
import { TestDbModule } from 'helpers/test/test-db.module';
import { UserService } from 'modules/user/services/user.service';
import { AuthService } from '../auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let testingModule: TestingModule;

    beforeAll(async () => {
        testingModule = await Test.createTestingModule({
            imports: [TestDbModule],
            providers: [
                AuthService,
                {
                    provide: UserService,
                    useFactory: () => ({}),
                },
            ],
        }).compile();

        service = testingModule.get<AuthService>(AuthService);
    });

    afterAll(() => testingModule.close());

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
