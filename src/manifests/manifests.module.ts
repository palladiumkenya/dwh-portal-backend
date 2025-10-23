import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { ManifestsController } from './manifests.controller';
import { FactManifest } from './entities/fact-manifest.model';
import { GetExpectedUploadsHandler } from './queries/handlers/get-expected-uploads.handler';
import { GetRecencyUploadsHandler } from './queries/handlers/get-recency-uploads.handler';
import { GetConsistencyUploadsHandler } from './queries/handlers/get-consistency-uploads.handler';
import { GetTrendsRecencyHandler } from './queries/handlers/get-trends-recency.handler';
import { GetTrendsConsistencyHandler } from './queries/handlers/get-trends-consistency.handler';
import { GetEmrDistributionHandler } from './queries/handlers/get-emr-distribution.handler';
import { GetOverallReportingHandler } from './queries/handlers/get-overall-reporting.handler';
import { GetOverallReportingByFacilityHandler } from './queries/handlers/get-overall-reporting-by-facility.handler';
import { GetConsistencyByFacilityHandler } from './queries/handlers/get-consistency-by-facility.handler';
import { GetRecencyByPartnerHandler } from './queries/handlers/get-recency-by-partner.handler';
import { GetRecencyByCountyHandler } from './queries/handlers/get-recency-by-county.handler';
import { GetConsistencyByCountyPartnerHandler } from './queries/handlers/get-consistency-by-county-partner.handler';
import { GetExpectedUploadsPartnerCountyHandler } from './queries/handlers/get-expected-uploads-partner-county.handler';
import { GetEMRInfoHandler } from './queries/handlers/get-emr-info.handler';
import { GetFacilityInfoHandler } from './queries/handlers/get-facility-info.handler';
import { EMRInfo } from './entities/emr-info.entity';
import { FacilityInfo } from './entities/facility-info.entity';
import { GetCtCountFacilitiesHandler } from '../common/queries/handlers/get-ct-count-facilities.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([EMRInfo, FacilityInfo]),
        TypeOrmModule.forFeature([FactManifest], 'mssql'),
    ],
    providers: [
        GetConsistencyUploadsHandler,
        GetConsistencyByFacilityHandler,
        GetExpectedUploadsHandler,
        GetRecencyUploadsHandler,
        GetTrendsRecencyHandler,
        GetTrendsConsistencyHandler,
        GetEmrDistributionHandler,
        GetOverallReportingHandler,
        GetOverallReportingByFacilityHandler,
        GetRecencyByCountyHandler,
        GetRecencyByPartnerHandler,
        GetConsistencyByCountyPartnerHandler,
        GetExpectedUploadsPartnerCountyHandler,
        GetEMRInfoHandler,
        GetFacilityInfoHandler,
        GetCtCountFacilitiesHandler
    ],
    controllers: [ManifestsController],
})
export class ManifestsModule {}
