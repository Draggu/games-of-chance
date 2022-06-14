import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity])],
    providers: [UserResolver, UserService],
    controllers: [UserController],
})
export class UserModule {}
