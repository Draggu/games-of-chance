import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRandomizerModule } from 'modules/game-randomizer/game-randomizer.module';
import { UserModule } from 'modules/user/user.module';
import { DiceResolver, DiceSeedResolver } from './dice.resolver';
import { DiceService } from './dice.service';
import { DiceRollEntity } from './entities/dice-roll.entity';
import { DiceSeedEntity } from './entities/dice-seed.entity';
import { DiceSeedSubscriber } from './subscribers/dice-seed.subscriber';

@Module({
    imports: [
        UserModule,
        GameRandomizerModule,
        TypeOrmModule.forFeature([DiceRollEntity, DiceSeedEntity]),
    ],
    providers: [
        DiceResolver,
        DiceSeedResolver,
        DiceService,
        DiceSeedSubscriber,
    ],
})
export class DiceModule {}
