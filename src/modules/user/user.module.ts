import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserSubscriber } from './subscribers/user.subscriber';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserResolver, UserService, UserSubscriber],
    exports: [UserService],
})
export class UserModule {}
