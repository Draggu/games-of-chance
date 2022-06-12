import { ObjectType, ID, Field, Int } from '@nestjs/graphql';
import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    Entity,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { hash } from 'bcrypt';

@Entity()
@ObjectType()
export class UserEntity {
    static readonly saltRound = 10;

    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column('integer', {
        default: 0,
    })
    @Field(() => Int)
    balance: number;

    @BeforeInsert()
    @BeforeUpdate()
    private async hashPassword() {
        if (this.password) {
            this.password = await hash(this.password, UserEntity.saltRound);
        }
    }
}
