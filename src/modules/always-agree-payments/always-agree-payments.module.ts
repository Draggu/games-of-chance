import { Module } from '@nestjs/common';
import { AlwaysAgreePaymentsService } from './always-agree-payments.service';
import { AlwaysAgreePaymentsResolver } from './always-agree-payments.resolver';
import { AlwaysAgreePaymentsController } from './always-agree-payments.controller';

@Module({
  providers: [AlwaysAgreePaymentsResolver, AlwaysAgreePaymentsService],
  controllers: [AlwaysAgreePaymentsController]
})
export class AlwaysAgreePaymentsModule {}
