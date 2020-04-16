import { Module } from '@nestjs/common';
import { DatabaseConnectionService } from './database-connection.service';

@Module({
    providers: [
        {
            provide: DatabaseConnectionService,
            useValue: new DatabaseConnectionService(
                `.env.${process.env.NODE_ENV || 'development'}`,
            ),
        },
    ],
    exports: [DatabaseConnectionService],
})
export class ConfigurationModule {}
