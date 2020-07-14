import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './config/config.module';
import { DatabaseConnectionService } from './config/database-connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './application/common/common.module';
import { ManifestsModule } from './application/manifests/manifests.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                `.env.${process.env.NODE_ENV ? process.env.NODE_ENV.trim() : 'development'}`,
            ],
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, ConfigurationModule],
            inject: [ConfigService, DatabaseConnectionService],
            useFactory: async (
                configService: ConfigService,
                dbConfig: DatabaseConnectionService,
            ) => ({
                type: 'mysql' as 'mysql',
                host: configService.get<string>('DATABASE_HOST', dbConfig.host),
                port: configService.get<number>(
                    'DATABASE_PORT',
                    Number(dbConfig.port),
                ),
                username: configService.get<string>('DATABASE_USER', dbConfig.username),
                password: configService.get<string>('DATABASE_PASS', dbConfig.password),
                database: configService.get<string>(
                    'DATABASE_SCHEMA',
                    dbConfig.database,
                ),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                migrationsTableName: 'custom_migration_table',
                migrations: ['migration/*.js'],
                cli: {
                    'migrationsDir': 'migration',
                },
            }),
        }),
        ConfigurationModule,
        CommonModule,
        ManifestsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
