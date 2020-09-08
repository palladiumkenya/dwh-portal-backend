import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { GetActiveArtHandler } from './queries/handlers/get-active-art.handler';
import { CareTreatmentController } from './controllers/care-treatment.controller';
import { GetActiveChildrenHandler } from './queries/handlers/get-active-children.handler';
import { GetActiveAdultsHandler } from './queries/handlers/get-active-adults.handler';
import { GetActiveArtAdolescentsHandler } from './queries/handlers/get-active-art-adolescents.handler';
import { GetActiveArtByGenderHandler } from './queries/handlers/get-active-art-by-gender.handler';
import { GetCtCountyHandler } from './queries/handlers/get-ct-county.handler';
import { GetCtSubCountyHandler } from './queries/handlers/get-ct-sub-county.handler';
import { GetCtFacilitiesHandler } from './queries/handlers/get-ct-facilities.handler';
import { GetCtPartnersHandler } from './queries/handlers/get-ct-partners.handler';
import { GetCtTxNewHandler } from './queries/handlers/get-ct-tx-new.handler';
import { FactTransNewlyStarted } from '../../entities/care_treatment/fact-trans-newly-started.model';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                FactTransHmisStatsTxcurr,
                FactTransNewlyStarted
            ],
            'mssql'
        )
    ],
    providers: [
        GetActiveArtHandler,
        GetActiveChildrenHandler,
        GetActiveAdultsHandler,
        GetActiveArtAdolescentsHandler,
        GetActiveArtByGenderHandler,
        GetCtCountyHandler,
        GetCtSubCountyHandler,
        GetCtFacilitiesHandler,
        GetCtPartnersHandler,
        GetCtTxNewHandler
    ],
    controllers: [CareTreatmentController]
})
export class CareTreatmentModule {}
