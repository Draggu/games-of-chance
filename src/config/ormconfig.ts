import { join } from 'path';
import { DataSource } from 'typeorm';

/**
 * datasource for typeorm cli
 */
export default new DataSource({
    type: 'postgres',
    username: 'postgres',
    useUTC: true,
    entities: [join(__dirname, '../modules/**/*.entity.{ts,js}')],
    migrations: [join(__dirname, '../migrations/*.{ts,js}')],
});
