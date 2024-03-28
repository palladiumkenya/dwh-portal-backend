import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../config/config.module';
import { SelfServiceController } from './self-service.controller';
import { GetMetabaseMonthlyHighlightHandler } from './metabase/queries/handlers/metabase-monthly-highlight.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
    ],
    providers: [
        GetMetabaseMonthlyHighlightHandler

    ],
    controllers: [SelfServiceController],
})
export class SelfServiceModule {}
