import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateUserInput } from './dto/update-user.input';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.userService.findById(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserInput) {
        return this.userService.update(id, updateUserDto);
    }
}
