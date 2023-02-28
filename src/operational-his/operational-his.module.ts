import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {ConfigurationModule} from '../config/config.module';
import {TypeOrmModule} from '@nestjs/typeorm';

import {OperationalHisController} from './operational-his.controller';


import {FactCtDhis2} from "./khis/entities/fact-ct-dhis2.model";


import {GetTxNewBySexHandler} from './khis/queries/handlers/get-tx-new-by-sex.handler';
import {GetNewlyStartedArtHandler} from "./khis/queries/handlers/get-newly-started-art.handler";
import {GetNewlyStartedArtTrendsHandler} from "./khis/queries/handlers/get-newly-started-art-trends.handler";
import {GetCurrentOnArtHandler} from "./khis/queries/handlers/get-current-on-art.handler";
import {FactHtsDhis2} from "./khis/entities/fact-hts-dhis2.model";
import {GetHtsPositivesTrendsHandler} from "./khis/queries/handlers/get-hts-positives-trends.handler";
import {GetCurrentOnArtByCountyHandler} from "./khis/queries/handlers/get-current-on-art-by-county.handler";
import {GetCurrentOnArtByPartnerHandler} from "./khis/queries/handlers/get-current-on-art-by-partner.handler";
import {GetTxCurrBySexHandler} from "./khis/queries/handlers/get-tx-curr-by-sex.handler";
import {FactTransHmisStatsTxcurr} from "../care-treatment/current-on-art/entities/fact-trans-hmis-stats-txcurr.model";
import {FactTransNewlyStarted} from "../care-treatment/new-on-art/entities/fact-trans-newly-started.model";
import {GetTxNewBySexDwhHandler} from "./khis/queries/handlers/get-tx-new-by-sex-dwh.handler";
import {GetTxCurrBySexDwhHandler} from "./khis/queries/handlers/get-tx-curr-by-sex-dwh.handler";
import { GetCtTxCurrAgeGroupDistributionByCountyHandler } from './khis/queries/handlers/get-ct-tx-curr-age-group-distribution-by-county.handler';
import { GetClosedTicketsHandler } from './help-desk/queries/handlers/get-closed-tickets.handler';
import { GetOpenIssuesByTypeHandler } from './help-desk/queries/handlers/get-open-issues-by-type.handler';
import { GetCreatedTicketsHandler } from './help-desk/queries/handlers/get-created-tickets.handler';
import { GetTicketsByCategoryHandler } from './help-desk/queries/handlers/get-tickets-by-category.handler';
import { GetOpenTicketsHandler } from './help-desk/queries/handlers/get-open-tickets.handler';
import { GetTicketsBySDPHandler } from './help-desk/queries/handlers/get-tickets-by-sdp.handler';
import { GetOpenIssuesByTypeAndSDPHandler } from './help-desk/queries/handlers/get-open-issues-by-type-and-sdp.handler';
import { GetDWHHTSPOSPositiveHandler } from './khis/queries/handlers/get-dwh-htspos.handler';
import { FactHtsUptakeAgeGender } from 'src/hts/uptake/entities/fact-htsuptake-agegender.entity';
import { GetKhisHTSPOSHandler } from './khis/queries/handlers/get-khis-htspos.handler';
import { GetKhisHTSPOSByCountyHandler } from './khis/queries/handlers/get-khis-htspos-by-county.handler';
import { GetKhisHTSPOSByPartnerHandler } from './khis/queries/handlers/get-khis-htspos-by-partner.handler';
import { GetKhisHTSPOSByFacilityHandler } from './khis/queries/handlers/get-khis-htspos-by-facility.handler';
import { GetDWHHTSPOSByAgeHandler } from './khis/queries/handlers/get-dwh-htspos-by-age.handler';
import { GetDWHHTSPOSByCountyHandler } from './khis/queries/handlers/get-dwh-htspos-by-county.handler';
import { GetDWHHTSPOSByFacilityHandler } from './khis/queries/handlers/get-dwh-htspos-by-facility.handler';
import { GetDWHHTSPOSByGenderHandler } from './khis/queries/handlers/get-dwh-htspos-by-gender.handler';
import { GetDWHHTSPOSByPartnerHandler } from './khis/queries/handlers/get-dwh-htspos-by-partner.handler';
import { GetKhisHTSTESTByCountyHandler } from './khis/queries/handlers/get-khis-htstest-by-county.handler';
import { GetKhisHTSTESTByPartnerHandler } from './khis/queries/handlers/get-khis-htstest-by-partner.handler';
import { GetKhisHTSTESTByFacilityHandler } from './khis/queries/handlers/get-khis-htstest-by-facility.handler';
import { GetKhisHTSTESTHandler } from './khis/queries/handlers/get-khis-htstest.handler';
import { GetDWHHTSTestTrendsHandler } from './khis/queries/handlers/get-dwh-htstest-trends.handler';
import { AggregateTXCurr } from 'src/care-treatment/current-on-art/entities/aggregate-txcurr.model';
import { AggregateCohortRetention } from 'src/care-treatment/new-on-art/entities/aggregate-cohort-retention.model';
import { FactHTSClientTests } from 'src/hts/linkage/entities/fact-hts-client-tests.model';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature([FactHtsUptakeAgeGender]),
        TypeOrmModule.forFeature(
            [
                FactTransHmisStatsTxcurr,
                FactTransNewlyStarted,
                FactCtDhis2,
                FactHtsDhis2,

                AggregateTXCurr,
                AggregateCohortRetention,
                FactHTSClientTests,
            ],
            'mssql',
        ),
    ],
    providers: [
        GetNewlyStartedArtHandler,
        GetNewlyStartedArtTrendsHandler,
        GetCurrentOnArtHandler,
        GetHtsPositivesTrendsHandler,
        GetCurrentOnArtByCountyHandler,
        GetCurrentOnArtByPartnerHandler,
        GetTxCurrBySexHandler,
        GetTxNewBySexHandler,
        GetTxNewBySexDwhHandler,
        GetTxCurrBySexDwhHandler,
        GetCtTxCurrAgeGroupDistributionByCountyHandler,
        GetClosedTicketsHandler,
        GetOpenIssuesByTypeHandler,
        GetCreatedTicketsHandler,
        GetTicketsByCategoryHandler,
        GetOpenTicketsHandler,
        GetTicketsBySDPHandler,
        GetOpenIssuesByTypeAndSDPHandler,
        GetDWHHTSPOSPositiveHandler,
        GetKhisHTSPOSHandler,
        GetKhisHTSPOSByCountyHandler,
        GetKhisHTSPOSByPartnerHandler,
        GetKhisHTSPOSByFacilityHandler,
        GetDWHHTSPOSByAgeHandler,
        GetDWHHTSPOSByCountyHandler,
        GetDWHHTSPOSByFacilityHandler,
        GetDWHHTSPOSByGenderHandler,
        GetDWHHTSPOSByPartnerHandler,
        GetKhisHTSTESTByCountyHandler,
        GetKhisHTSTESTByPartnerHandler,
        GetKhisHTSTESTByFacilityHandler,
        GetKhisHTSTESTHandler,
        GetDWHHTSTestTrendsHandler,
    ],
    controllers: [OperationalHisController],
})
export class OperationalHisModule {}
