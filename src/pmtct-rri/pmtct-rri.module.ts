import {Module} from '@nestjs/common';
import {CqrsModule} from '@nestjs/cqrs';
import {ConfigurationModule} from '../config/config.module';
import {TypeOrmModule} from '@nestjs/typeorm';

import {PmtctRRIController} from './pmtct-rri.controller';

import { AggregateTXCurr } from 'src/care-treatment/current-on-art/entities/aggregate-txcurr.model';
import { MissedTestingFirstANC } from './missed-anc/entities/missed-testing-first-anc.model';

import { GetMissedANCOverviewHandler } from './missed-anc/queries/handlers/get-missed-anc-overview.handler';
import { GetMissedANCByCountyHandler } from './missed-anc/queries/handlers/get-missed-anc-by-county.handler';
import { GetMissedANCBySDPHandler } from './missed-anc/queries/handlers/get-missed-anc-by-sdp.handler';
import { GetMissedANCGapsHandler } from './missed-anc/queries/handlers/get-missed-anc-gaps.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [AggregateTXCurr, MissedTestingFirstANC],
            'mssql',
        ),
    ],
    providers: [
        GetMissedANCOverviewHandler,
        GetMissedANCByCountyHandler,
        GetMissedANCBySDPHandler,
        GetMissedANCGapsHandler,
    ],
    controllers: [PmtctRRIController],
})
export class PmtctRRIModule {}
