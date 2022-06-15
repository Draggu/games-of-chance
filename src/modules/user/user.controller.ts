import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { CurrentUser } from 'decorators/current-user.decorator';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    findOne(@CurrentUser() currentUser: CurrentUser, @Param('id') id: string) {
        return this.userService.findById(currentUser, id);
    }

    @Patch(':id')
    update(
        @CurrentUser() currentUser: CurrentUser,
        @Body() updateUserDto: UpdateUserInput,
    ) {
        return this.userService.update(currentUser, updateUserDto);
    }
}
