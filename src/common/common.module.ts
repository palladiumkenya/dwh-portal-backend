import { Module } from '@nestjs/common';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { GetCountiesHandler } from './queries/handlers/get-counties.handler';
import { GetSubCountiesHandler } from './queries/handlers/get-sub-counties.handler';
import { GetFacilitiesHandler } from './queries/handlers/get-facilities.handler';
import { GetPartnersHandler } from './queries/handlers/get-partners.handler';
import { GetAgenciesHandler } from './queries/handlers/get-agencies.handler';
import { GetSitesHandler } from './queries/handlers/get-sites.handler';
import { GetFacilityStatusHandler } from './queries/handlers/get-facility-status.handler';
import { GetFacilityStatusByPartnerHandler } from './queries/handlers/get-facility-status-by-partner.handler';
import { GetFacilityLevelByOwnershipPartnerHandler } from './queries/handlers/get-facility-level-by-ownership-partner.handler';
import { GetFacilityLevelByOwnershipCountyHandler } from './queries/handlers/get-facility-level-by-ownership-county.handler';
import { GetFacilityByInfrastructureHandler } from './queries/handlers/get-facility-by-infrastructure.handler';
import { GetFacilityLinelistHandler } from './queries/handlers/get-facility-linelist.handler';
import { GetFacilityTxcurrHandler } from './queries/handlers/get-facility-txcurr.handler';
import { GetFacilityStatusByCountyHandler } from './queries/handlers/get-facility-status-by-county.handler';
import { GetFacilityByInfrastructureCountyHandler } from './queries/handlers/get-facility-by-infrastructure-county.handler';
import { GetFacilityArtHtsMnchHandler } from './queries/handlers/get-facility-art-hts-mnch.handler';
import { GetCountyCoverageHtsHandler } from './queries/handlers/get-county-coverage-hts.handler';
import { CommonController } from './common.controller';
import { AllEmrSites } from '../care-treatment/common/entities/all-emr-sites.model';
import { LinelistFACTART } from '../care-treatment/common/entities/linelist-fact-art.model';
import { GetCtCountFacilitiesHandler } from './queries/handlers/get-ct-count-facilities.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([AllEmrSites, LinelistFACTART], 'mssql')
    ],
    providers: [
        GetCountiesHandler,
        GetSubCountiesHandler,
        GetFacilitiesHandler,
        GetPartnersHandler,
        GetAgenciesHandler,
        GetSitesHandler,
        GetFacilityStatusHandler,
        GetFacilityStatusByPartnerHandler,
        GetFacilityLevelByOwnershipPartnerHandler,
        GetFacilityLevelByOwnershipCountyHandler,
        GetFacilityByInfrastructureHandler,
        GetFacilityLinelistHandler,
        GetFacilityTxcurrHandler,
        GetFacilityStatusByCountyHandler,
        GetFacilityByInfrastructureCountyHandler,
        GetFacilityArtHtsMnchHandler,
        GetCountyCoverageHtsHandler,
        GetCtCountFacilitiesHandler
    ],
    controllers: [CommonController],
})

export class CommonModule {

}
