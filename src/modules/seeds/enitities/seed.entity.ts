import { ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class SeedEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column({
        unique: true,
        type: 'date',
        default: () => 'CURRENT_DATE',
    })
    day: string;

    @Column()
    privateKey: string;

    @Column()
    publicKey: string;
}
