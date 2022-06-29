import { Injectable } from '@nestjs/common';
import * as DataLoader from 'dataloader';
import * as _ from 'lodash';
import { UserEntity } from 'modules/user/entities/user.entity';
import { UserService } from 'modules/user/services/user.service';

@Injectable()
export class UserDataloader extends DataLoader<string, UserEntity> {
    constructor(private readonly userService: UserService) {
        super(async (userIds) => {
            const users = await this.userService.findByIds(userIds as string[]);

            const usersById = _.keyBy(users, 'id');

            return userIds.map((userId) => usersById[userId]);
        });
    }
}
