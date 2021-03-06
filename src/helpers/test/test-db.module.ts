import { TypeOrmModule } from '@nestjs/typeorm';

export const TestDbModule = TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5032,
    username: 'postgres',
    password: '',
    database: 'test',
    autoLoadEntities: true,
    synchronize: true,
    dropSchema: true,
});
