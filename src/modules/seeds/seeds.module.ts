import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CronModule } from 'infrastructure/cron/cron.module';
import { RedisModule } from 'infrastructure/redis/redis.module';
import { SeedEntity } from './enitities/seed.entity';
import { SeedsController } from './seeds.controller';
import { SeedsResolver } from './seeds.resolver';
import { SeedsService } from './seeds.service';

@Module({
    imports: [RedisModule, CronModule, TypeOrmModule.forFeature([SeedEntity])],
    providers: [SeedsService, SeedsResolver],
    exports: [SeedsService],
    controllers: [SeedsController],
})
export class SeedsModule {}
