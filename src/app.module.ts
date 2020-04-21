import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './config/config.module';
import { DatabaseConnectionService } from './config/database-connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ReportingRatesModule } from './reporting-rates/reporting-rates.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: [
                `.env.${process.env.NODE_ENV.trim() || 'development'}`,
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
                host: configService.get('DATABASE_HOST', dbConfig.host),
                port: configService.get<number>(
                    'DATABASE_PORT',
                    Number(dbConfig.port),
                ),
                username: configService.get('DATABASE_USER', dbConfig.username),
                password: configService.get('DATABASE_PASS', dbConfig.password),
                database: configService.get(
                    'DATABASE_SCHEMA',
                    dbConfig.database,
                ),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
            }),
        }),
        ConfigurationModule,
        ReportingRatesModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
