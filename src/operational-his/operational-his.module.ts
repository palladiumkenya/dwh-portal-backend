import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {ConfigurationModule} from '../config/config.module';
import {TypeOrmModule} from '@nestjs/typeorm';

import {OperationalHisController} from './operational-his.controller';

import {FactTransNewCohort} from './new-on-art/entities/fact-trans-new-cohort.model';
import {FactTransNewlyStarted} from './new-on-art/entities/fact-trans-newly-started.model';
import {FactCTTimeToArt} from './new-on-art/entities/fact-ct-time-to-art-grp.model';
import {FactCtDhis2} from "./khis/entities/fact-ct-dhis2.model";

import {GetTxNewTrendsHandler} from './new-on-art/queries/handlers/get-tx-new-trends.handler';
import {GetTxNewByAgeSexHandler} from './new-on-art/queries/handlers/get-tx-new-by-age-sex.handler';
import {GetTxNewBySexHandler} from './new-on-art/queries/handlers/get-tx-new-by-sex.handler';
import {GetTimeToArtHandler} from './new-on-art/queries/handlers/get-time-to-art.handler';
import {GetTimeToArtFacilitiesHandler} from './new-on-art/queries/handlers/get-time-to-art-facilities.handler';

import {GetNewlyStartedArtHandler} from "./khis/queries/handlers/get-newly-started-art.handler";
import {GetNewlyStartedArtTrendsHandler} from "./khis/queries/handlers/get-newly-started-art-trends.handler";
import {GetCurrentOnArtHandler} from "./khis/queries/handlers/get-current-on-art.handler";
import {FactHtsDhis2} from "./khis/entities/fact-hts-dhis2.model";
import {GetHtsPositivesTrendsHandler} from "./khis/queries/handlers/get-hts-positives-trends.handler";
import {GetCurrentOnArtByCountyHandler} from "./khis/queries/handlers/get-current-on-art-by-county.handler";
import {GetCurrentOnArtByPartnerHandler} from "./khis/queries/handlers/get-current-on-art-by-partner.handler";

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                FactTransNewlyStarted,
                FactCTTimeToArt,
                FactTransNewCohort,
                FactCtDhis2,
                FactHtsDhis2
            ],
            'mssql'
        )
    ],
    providers: [
        GetTxNewTrendsHandler,
        GetTxNewByAgeSexHandler,
        GetTxNewBySexHandler,
        GetTimeToArtHandler,
        GetTimeToArtFacilitiesHandler,

        GetNewlyStartedArtHandler,
        GetNewlyStartedArtTrendsHandler,
        GetCurrentOnArtHandler,
        GetHtsPositivesTrendsHandler,
        GetCurrentOnArtByCountyHandler,
        GetCurrentOnArtByPartnerHandler
    ],
    controllers: [OperationalHisController]
})
export class OperationalHisModule {
}
