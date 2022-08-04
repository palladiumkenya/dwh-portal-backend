import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './config/config.module';
import { DatabaseConnectionService } from './config/database-connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { ManifestsModule } from './manifests/manifests.module';
import { HtsModule } from './hts/hts.module';
import { CareTreatmentModule } from './care-treatment/care-treatment.module';
import { OperationalHisModule } from './operational-his/operational-his.module';

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
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule, ConfigurationModule],
            inject: [ConfigService, DatabaseConnectionService],
            name: 'mssql',
            useFactory: async (
                configService: ConfigService,
                dbConfig: DatabaseConnectionService,
            ) => ({
                type: 'mssql' as 'mssql',
                host: configService.get<string>('DATABASE_HOST_MSSQL', dbConfig.hostMssql),
                username: configService.get<string>('DATABASE_USER_MSSQL', dbConfig.usernameMssql),
                password: configService.get<string>('DATABASE_PASSWORD_MSSQL', dbConfig.passwordMssql),
                database: configService.get<string>(
                    'DATABASE_DB_MSSQL',
                    dbConfig.databaseMssql,
                ),
                requestTimeout: 300000000,
                entities: [__dirname + '/**/*.model{.ts,.js}']
            }),
        }),
        ConfigurationModule,
        CommonModule,
        ManifestsModule,
        HtsModule,
        CareTreatmentModule,
        OperationalHisModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
