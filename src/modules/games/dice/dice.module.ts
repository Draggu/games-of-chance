import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameRandomizerModule } from 'modules/game-randomizer/game-randomizer.module';
import { UserModule } from 'modules/user/user.module';
import { DiceRollEntity } from './entities/dice-roll.entity';
import { DiceSeedEntity } from './entities/dice-seed.entity';
import { DiceRollUserFieldsResolver } from './fields-resolvers/dice-roll-user-fields.resolver';
import { UserDiceFieldsResolver } from './fields-resolvers/user-dice-fields.resolver';
import { DiceRollResolver } from './resolvers/dice-roll.resolver';
import { DiceSeedResolver } from './resolvers/dice-seed.resolver';
import { DiceRollService } from './services/dice-roll.service';
import { DiceSeedService } from './services/dice-seed.service';
import { DiceSeedSubscriber } from './subscribers/dice-seed.subscriber';

@Module({
    imports: [
        UserModule,
        GameRandomizerModule,
        TypeOrmModule.forFeature([DiceRollEntity, DiceSeedEntity]),
    ],
    providers: [
        DiceRollResolver,
        DiceSeedResolver,
        UserDiceFieldsResolver,
        DiceRollUserFieldsResolver,
        DiceRollService,
        DiceSeedService,
        DiceSeedSubscriber,
    ],
})
export class DiceModule {}
