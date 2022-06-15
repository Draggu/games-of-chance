import { Injectable } from '@nestjs/common';
import { CurrentUser } from 'decorators/current-user.decorator';
import { UserService } from 'modules/user/user.service';

@Injectable()
export class AlwaysAgreePaymentsService {
    constructor(private readonly userService: UserService) {}

    deposit(currentUser: CurrentUser, value: number) {
        return this.userService.deposit(currentUser, value);
    }

    withdraw(currentUser: CurrentUser, value: number) {
        return this.userService.withdraw(currentUser, value);
    }
}
