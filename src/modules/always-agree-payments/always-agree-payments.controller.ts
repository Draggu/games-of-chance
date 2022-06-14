import { Body, Controller, ParseIntPipe, Post } from '@nestjs/common';
import { CurrentUser } from 'decorators/current-user.decorator';
import { AlwaysAgreePaymentsService } from './always-agree-payments.service';

@Controller('payments')
export class AlwaysAgreePaymentsController {
    constructor(
        private readonly alwaysAgreePaymentsService: AlwaysAgreePaymentsService,
    ) {}

    @Post('deposit')
    deposit(
        @CurrentUser() currentUser: CurrentUser,
        @Body('value', ParseIntPipe) value: number,
    ) {
        return this.alwaysAgreePaymentsService.deposit(currentUser, value);
    }

    @Post('withdraw')
    withdraw(
        @CurrentUser() currentUser: CurrentUser,
        @Body('value', ParseIntPipe) value: number,
    ) {
        return this.alwaysAgreePaymentsService.withdraw(currentUser, value);
    }
}
