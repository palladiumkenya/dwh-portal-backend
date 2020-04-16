import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ManifestsModule } from './manifests/manifests.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigurationModule } from './config/config.module';
import { DatabaseConnectionService } from './config/database-connection.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
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
        ManifestsModule,
        ConfigurationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
