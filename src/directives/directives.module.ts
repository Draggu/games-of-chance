import { Module } from '@nestjs/common';
import { AuthModule } from 'modules/auth/auth.module';
import { AuthDirective } from './auth/auth.directive';
import { BalanceDirective } from './balance/balance.directive';

const providers = [AuthDirective, BalanceDirective];

@Module({
    imports: [AuthModule],
    providers,
    exports: providers,
})
export class DirectivesModule {}
