import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { KeyKind } from '../consts';

@Entity()
export class SecretKeyEntity {
    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    key: string;

    @Column({
        type: 'enum',
        enum: KeyKind,
    })
    type: KeyKind;

    /**
     * yyyy-mm-dd
     */
    @Column({
        unique: true,
        type: 'date',
        default: () => 'CURRENT_DATE',
    })
    day: string;
}
