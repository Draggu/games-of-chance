import { Module } from '@nestjs/common';
import { AlwaysAgreePaymentsController } from './always-agree-payments.controller';
import { AlwaysAgreePaymentsResolver } from './always-agree-payments.resolver';
import { AlwaysAgreePaymentsService } from './always-agree-payments.service';

@Module({
    providers: [AlwaysAgreePaymentsResolver, AlwaysAgreePaymentsService],
    controllers: [AlwaysAgreePaymentsController],
})
export class AlwaysAgreePaymentsModule {}
