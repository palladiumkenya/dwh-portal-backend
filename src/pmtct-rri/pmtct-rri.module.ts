import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {ConfigurationModule} from '../config/config.module';
import {TypeOrmModule} from '@nestjs/typeorm';

import {PmtctRRIController} from './pmtct-rri.controller';

import { AggregateTXCurr } from 'src/care-treatment/current-on-art/entities/aggregate-txcurr.model';
import { MissedTestingFirstANC } from './missed-anc/entities/missed-testing-first-anc.model';
import { MissedMaternalHaart } from './missed-haart/entities/missed-maternal-haart.model';
import { MissedEIDTesting } from './missed-eid/entities/missed-eid-testing.model';
import { MissedInfantProphylaxis } from './missed-infant-prophylaxis/entities/missed-infact-prophylaxis.model';
import { MissedViralLoad } from './missed-viral-load/entities/missed-viral-load.model';

import { GetMissedANCOverviewHandler } from './missed-anc/queries/handlers/get-missed-anc-overview.handler';
import { GetMissedANCByCountyHandler } from './missed-anc/queries/handlers/get-missed-anc-by-county.handler';
import { GetMissedANCBySDPHandler } from './missed-anc/queries/handlers/get-missed-anc-by-sdp.handler';
import { GetMissedANCGapsHandler } from './missed-anc/queries/handlers/get-missed-anc-gaps.handler';
import { GetMissedHAARTOverviewHandler } from './missed-haart/queries/handlers/get-missed-haart-overview.handler';
import { GetMissedHAARTBySDPHandler } from './missed-haart/queries/handlers/get-missed-haart-by-sdp.handler';
import { GetMissedHAARTByCountyHandler } from './missed-haart/queries/handlers/get-missed-haart-by-county.handler';
import { GetMissedHAARTByFacilityHandler } from './missed-haart/queries/handlers/get-missed-haart-by-facility.handler';
import { GetMissedEIDOverviewHandler } from './missed-eid/queries/handlers/get-missed-eid-overview.handler';
import { GetMissedEIDAgeFirstPCRHandler } from './missed-eid/queries/handlers/get-missed-eid-age-first-pcr.handler';
import { GetMissedEIDAgeFirstPCRCountyHandler } from './missed-eid/queries/handlers/get-missed-eid-age-first-pcr-county.handler';
import { GetMissedEIDAgeFirstPCRSDPHandler } from './missed-eid/queries/handlers/get-missed-eid-age-first-pcr-sdp.handler';
import { GetMissedInfantProphylaxisHandler } from './missed-infant-prophylaxis/queries/handlers/get-missed-infant-prophylaxis.handler';
import { GetMissedEIDMissngPCRHandler } from './missed-eid/queries/handlers/get-missed-eid-missing-pcr.handler';
import { GetMissedViralLoadHandler } from './missed-viral-load/queries/handlers/get-missed-viral-load.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                AggregateTXCurr,
                MissedTestingFirstANC,
                MissedMaternalHaart,
                MissedEIDTesting,
                MissedInfantProphylaxis,
                MissedViralLoad,
            ],
            'mssql',
        ),
    ],
    providers: [
        GetMissedANCOverviewHandler,
        GetMissedANCByCountyHandler,
        GetMissedANCBySDPHandler,
        GetMissedANCGapsHandler,

        GetMissedHAARTOverviewHandler,
        GetMissedHAARTBySDPHandler,
        GetMissedHAARTByCountyHandler,
        GetMissedHAARTByFacilityHandler,

        GetMissedEIDOverviewHandler,
        GetMissedEIDAgeFirstPCRHandler,
        GetMissedEIDAgeFirstPCRCountyHandler,
        GetMissedEIDAgeFirstPCRSDPHandler,
        GetMissedEIDMissngPCRHandler,

        GetMissedInfantProphylaxisHandler,

        GetMissedViralLoadHandler,
    ],
    controllers: [PmtctRRIController],
})
export class PmtctRRIModule {}
