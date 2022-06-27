import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserResolver } from './resolvers/user.resolver';
import { UserBalanceService } from './services/user-balance.service';
import { UserService } from './services/user.service';
import { UserSubscriber } from './subscribers/user.subscriber';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserResolver, UserService, UserBalanceService, UserSubscriber],
    exports: [UserService, UserBalanceService],
})
export class UserModule {}
