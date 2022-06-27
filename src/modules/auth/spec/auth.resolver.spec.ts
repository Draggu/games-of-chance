import { Test, TestingModule } from '@nestjs/testing';
import { AuthResolver } from '../resolvers/auth.resolver';
import { AuthService } from '../services/auth.service';

describe('AuthResolver', () => {
    let resolver: AuthResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                AuthResolver,
                {
                    provide: AuthService,
                    useFactory: () => ({}),
                },
            ],
        }).compile();

        resolver = module.get<AuthResolver>(AuthResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
