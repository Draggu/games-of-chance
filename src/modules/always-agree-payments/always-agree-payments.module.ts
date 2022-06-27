import { Module } from '@nestjs/common';
import { UserModule } from 'modules/user/user.module';
import { AlwaysAgreePaymentsResolver } from './resolvers/always-agree-payments.resolver';
import { AlwaysAgreePaymentsService } from './services/always-agree-payments.service';

@Module({
    imports: [UserModule],
    providers: [AlwaysAgreePaymentsResolver, AlwaysAgreePaymentsService],
})
export class AlwaysAgreePaymentsModule {}
