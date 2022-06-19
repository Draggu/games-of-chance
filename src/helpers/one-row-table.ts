import { PrimaryColumn } from 'typeorm';

export const OneRowTable = () =>
    PrimaryColumn({
        type: 'smallint',
        default: 1,
        nullable: false,
        unique: true,
        generatedIdentity: 'ALWAYS',
        generatedType: 'STORED',
    });
