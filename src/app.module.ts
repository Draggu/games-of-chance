import { Module, ValidationPipe } from '@nestjs/common';
import { AllwaysAgreePaymentsModule } from 'modules/allways-agree-payments/allways-agree-payments.module';
import { UserModule } from 'modules/user/user.module';
import { AuthModule } from 'modules/auth/auth.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { AuthGuard } from 'guards/auth.guard';

@Module({
    imports: [AllwaysAgreePaymentsModule, UserModule, AuthModule],
    providers: [
        {
            provide: APP_PIPE,
            useValue: new ValidationPipe({ whitelist: true, transform: true }),
        },
        {
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
    ],
})
export class AppModule {}
