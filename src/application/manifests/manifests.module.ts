import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ManifestsController } from './controllers/manifests.controller';
import { FactManifest } from '../../entities/manifests/fact-manifest.entity';
import { GetExpectedUploadsHandler } from './queries/handlers/get-expected-uploads.handler';
import { GetRecencyUploadsHandler } from './queries/handlers/get-recency-uploads.handler';
import { GetConsistencyUploadsHandler } from './queries/handlers/get-consistency-uploads.handler';
import { GetTrendsRecencyHandler } from './queries/handlers/get-trends-recency.handler';
import { GetTrendsConsistencyHandler } from './queries/handlers/get-trends-consistency.handler';
import { GetEmrDistributionHandler } from './queries/handlers/get-emr-distribution.handler';
import { GetOverallReportingHandler } from './queries/handlers/get-overall-reporting.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([FactManifest])],
    providers: [
        GetConsistencyUploadsHandler,
        GetExpectedUploadsHandler,
        GetRecencyUploadsHandler,
        GetTrendsRecencyHandler,
        GetTrendsConsistencyHandler,
        GetEmrDistributionHandler,
        GetOverallReportingHandler
    ],
    controllers: [ManifestsController],
})

export class ManifestsModule {

}
