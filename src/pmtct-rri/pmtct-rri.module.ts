import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {ConfigurationModule} from '../config/config.module';
import {TypeOrmModule} from '@nestjs/typeorm';

import {PmtctRRIController} from './pmtct-rri.controller';

import { AggregateTXCurr } from 'src/care-treatment/current-on-art/entities/aggregate-txcurr.model';
import { MissedTestingFirstANC } from './missed-anc/entities/missed-testing-first-anc.model';
import { MissedMaternalHaart } from './missed-haart/entities/missed-maternal-haart.model';

import { GetMissedANCOverviewHandler } from './missed-anc/queries/handlers/get-missed-anc-overview.handler';
import { GetMissedANCByCountyHandler } from './missed-anc/queries/handlers/get-missed-anc-by-county.handler';
import { GetMissedANCBySDPHandler } from './missed-anc/queries/handlers/get-missed-anc-by-sdp.handler';
import { GetMissedANCGapsHandler } from './missed-anc/queries/handlers/get-missed-anc-gaps.handler';
import { GetMissedHAARTOverviewHandler } from './missed-haart/queries/handlers/get-missed-haart-overview.handler';
import { GetMissedHAARTBySDPHandler } from './missed-haart/queries/handlers/get-missed-haart-by-sdp.handler';
import { GetMissedHAARTByCountyHandler } from './missed-haart/queries/handlers/get-missed-haart-by-county.handler';
import { GetMissedHAARTByFacilityHandler } from './missed-haart/queries/handlers/get-missed-haart-by-facility.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [AggregateTXCurr, MissedTestingFirstANC, MissedMaternalHaart],
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
    ],
    controllers: [PmtctRRIController],
})
export class PmtctRRIModule {}
