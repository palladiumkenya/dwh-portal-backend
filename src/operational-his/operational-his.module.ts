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

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                FactTransHmisStatsTxcurr,
                FactTransNewlyStarted,
                FactCtDhis2,
                FactHtsDhis2,
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
    ],
    controllers: [OperationalHisController],
})
export class OperationalHisModule {}
