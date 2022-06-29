import { Module } from '@nestjs/common';
import { AuthModule } from 'modules/auth/auth.module';
import { AuthDirective } from './auth/auth.directive';
import { BalanceDirective } from './balance/balance.directive';
import { MaybeInProgressDirective } from './maybe-in-progress/maybe-in-progress.directive';

const directives = [AuthDirective, BalanceDirective, MaybeInProgressDirective];

@Module({
    imports: [AuthModule],
    providers: directives,
    exports: directives,
})
export class DirectivesModule {}
