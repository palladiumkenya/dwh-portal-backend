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
import { GetCtStabilityStatusAmongActivePatientsHandler } from './queries/handlers/get-ct-stability-status-among-active-patients.handler';
import { FactTransDsdCascade } from '../../entities/care_treatment/fact-trans-dsd-cascade.model';
import { GetCtViralLoadCascadeActiveArtClientsHandler } from './queries/handlers/get-ct-viral-load-cascade-active-art-clients.handler';
import { GetCtViralLoadSuppressionPercentageHandler } from './queries/handlers/get-ct-viral-load-suppression-percentage.handler';
import { GetCtTxCurrByAgeAndSexHandler } from './queries/handlers/get-ct-tx-curr-by-age-and-sex.handler';
import { GetCtTxCurrDistributionByCountyHandler } from './queries/handlers/get-ct-tx-curr-distribution-by-county.handler';
import { GetCtTxCurrDistributionByPartnerHandler } from './queries/handlers/get-ct-tx-curr-distribution-by-partner.handler';
import { GetTxNewTrendsHandler } from './queries/handlers/get-tx-new-trends.handler';
import { GetTxNewByAgeSexHandler } from './queries/handlers/get-tx-new-by-age-sex.handler';
import { GetTimeToArtHandler } from './queries/handlers/get-time-to-art.handler';
import { GetTimeToArtFacilitiesHandler } from './queries/handlers/get-time-to-art-facilities.handler';
import { GetMedianTimeToArtByYearHandler } from './queries/handlers/get-median-time-to-art-by-year.handler';
import { GetMedianTimeToArtByCountyHandler } from './queries/handlers/get-median-time-to-art-by-county.handler';
import { GetMedianTimeToArtByPartnerHandler } from './queries/handlers/get-median-time-to-art-by-partner.handler';
import { FactCTTimeToArt } from 'src/entities/care_treatment/fact-ct-time-to-art-grp.model';
import { FactTransDsdUnstable } from 'src/entities/care_treatment/fact-trans-dsd-unstable.model';
import { FactTransDsdMmdStable } from 'src/entities/care_treatment/fact-trans-dsd-mmd-stable.model';
import { FactTransDsdStabilityStatus } from 'src/entities/care_treatment/fact-trans-dsd-stability-status.model';
import { GetDsdCascadeHandler } from './queries/handlers/get-dsd-cascade.handler';
import { GetDsdUnstableHandler } from './queries/handlers/get-dsd-unstable.handler';
import { GetDsdMmdStableHandler } from './queries/handlers/get-dsd-mmd-stable.handler';
import { GetDsdStabilityStatusHandler } from './queries/handlers/get-dsd-stability-status.handler';
import { GetDsdStabilityStatusByAgeSexHandler } from './queries/handlers/get-dsd-stability-status-by-age-sex.handler';
import { GetDsdStabilityStatusByCountyHandler } from './queries/handlers/get-dsd-stability-status-by-county.handler';
import { GetDsdStabilityStatusByPartnerHandler } from './queries/handlers/get-dsd-stability-status-by-partner.handler';
import { GetDsdAppointmentDurationBySexHandler } from './queries/handlers/get-dsd-appointment-duration-by-sex.handler';
import { GetDsdAppointmentDurationByAgeHandler } from './queries/handlers/get-dsd-appointment-duration-by-age.handler';
import { GetDsdAppointmentDurationByCountyHandler } from './queries/handlers/get-dsd-appointment-duration-by-county.handler';
import { GetDsdAppointmentDurationByPartnerHandler } from './queries/handlers/get-dsd-appointment-duration-by-partner.handler';
import { FactTransDsdAppointmentByStabilityStatus } from '../../entities/care_treatment/fact-trans-dsd-appointment-by-stability-status.model';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusHandler } from './queries/handlers/get-dsd-appointment-duration-categorization-by-stability-status.handler';
import { GetCtTxCurrAgeGroupDistributionByCountyHandler } from './queries/handlers/get-ct-tx-curr-age-group-distribution-by-county.handler';
import { FactTransNewCohort } from '../../entities/care_treatment/fact-trans-new-cohort.model';
import { FactTransTreatmentOutcomes } from '../../entities/care_treatment/fact-trans-treatment-outcomes.model';
import { GetTreatmentOutcomesOverallHandler } from './queries/handlers/get-treatment-outcomes-overall.handler';
import { GetTreatmentOutcomesBySexHandler } from './queries/handlers/get-treatment-outcomes-by-sex.handler';
import { GetTreatmentOutcomesByAgeHandler } from './queries/handlers/get-treatment-outcomes-by-age.handler';
import { GetTreatmentOutcomesByYearHandler } from './queries/handlers/get-treatment-outcomes-by-year.handler';
import { GetTreatmentOutcomesByCountyHandler } from './queries/handlers/get-treatment-outcomes-by-county.handler';
import { GetTreatmentOutcomesByPartnerHandler } from './queries/handlers/get-treatment-outcomes-by-partner.handler';
import { FactTransRetention } from '../../entities/care_treatment/fact-trans-retention.model';
import { GetTreatmentOutcomesRetention3mHandler } from './queries/handlers/get-treatment-outcomes-retention-3m.handler';
import { GetTreatmentOutcomesRetention6mHandler } from './queries/handlers/get-treatment-outcomes-retention-6m.handler';
import { GetTreatmentOutcomesRetention12mHandler } from './queries/handlers/get-treatment-outcomes-retention-12m.handler';
import { GetTreatmentOutcomesRetention24mHandler } from './queries/handlers/get-treatment-outcomes-retention-24m.handler';
import { GetCtTxCurrAgeGroupDistributionByPartnerHandler } from './queries/handlers/get-ct-tx-curr-age-group-distribution-by-partner.handler';
import { FactTransVLOutcome } from '../../entities/care_treatment/fact-trans-vl-outcome.model';
import { FactTransVLOverallUptake } from '../../entities/care_treatment/fact-trans-vl-overall-uptake.model';
import { GetVlOverallUptakeAndSuppressionHandler } from './queries/handlers/get-vl-overall-uptake-and-suppression.handler';
import { GetVlUptakeBySexHandler } from './queries/handlers/get-vl-uptake-by-sex.handler';
import { GetVlUptakeByAgeHandler } from './queries/handlers/get-vl-uptake-by-age.handler';
import { GetVlUptakeByCountyHandler } from './queries/handlers/get-vl-uptake-by-county.handler';
import { GetVlUptakeByPartnerHandler } from './queries/handlers/get-vl-uptake-by-partner.handler';
import { GetVlOutcomesOverallHandler } from './queries/handlers/get-vl-outcomes-overall.handler';
import { GetVlOutcomesBySexHandler } from './queries/handlers/get-vl-outcomes-by-sex.handler';
import { GetVlSuppressionByAgeHandler } from './queries/handlers/get-vl-suppression-by-age.handler';
import { GetVlSuppressionByRegimenHandler } from './queries/handlers/get-vl-suppression-by-regimen.handler';
import { GetVlSuppressionByYearHandler } from './queries/handlers/get-vl-suppression-by-year.handler';
import { GetVlSuppressionByCountyHandler } from './queries/handlers/get-vl-suppression-by-county.handler';
import { GetVlSuppressionByPartnerHandler } from './queries/handlers/get-vl-suppression-by-partner.handler';
import { GetVlOverallUptakeAndSuppressionByFacilityHandler } from './queries/handlers/get-vl-overall-uptake-and-suppression-by-facility.handler';
import { FactCTTimeToFirstVL } from '../../entities/care_treatment/fact-ct-time-to-first-vl-grp.model';
import { GetVlMedianTimeToFirstVlByYearHandler } from './queries/handlers/get-vl-median-time-to-first-vl-by-year.handler';
import { GetVlMedianTimeToFirstVlByCountyHandler } from './queries/handlers/get-vl-median-time-to-first-vl-by-county.handler';
import { GetVlMedianTimeToFirstVlByPartnerHandler } from './queries/handlers/get-vl-median-time-to-first-vl-by-partner.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                FactTransHmisStatsTxcurr,
                FactTransNewlyStarted,
                FactCTTimeToArt,
                FactTransDsdCascade,
                FactTransDsdUnstable,
                FactTransDsdMmdStable,
                FactTransDsdStabilityStatus,
                FactTransDsdAppointmentByStabilityStatus,
                FactTransNewCohort,
                FactTransTreatmentOutcomes,
                FactTransRetention,
                FactTransVLOutcome,
                FactTransVLOverallUptake,
                FactCTTimeToFirstVL,
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
        GetCtTxNewHandler,
        GetCtStabilityStatusAmongActivePatientsHandler,
        GetCtViralLoadCascadeActiveArtClientsHandler,
        GetCtViralLoadSuppressionPercentageHandler,
        GetCtTxCurrByAgeAndSexHandler,
        GetCtTxCurrDistributionByCountyHandler,
        GetCtTxCurrDistributionByPartnerHandler,
        GetTxNewTrendsHandler,
        GetTxNewByAgeSexHandler,
        GetTimeToArtHandler,
        GetTimeToArtFacilitiesHandler,
        GetMedianTimeToArtByYearHandler,
        GetMedianTimeToArtByCountyHandler,
        GetMedianTimeToArtByPartnerHandler,
        GetCtViralLoadSuppressionPercentageHandler,
        GetCtTxCurrByAgeAndSexHandler,
        GetDsdCascadeHandler,
        GetDsdUnstableHandler,
        GetDsdMmdStableHandler,
        GetDsdStabilityStatusHandler,
        GetDsdStabilityStatusByAgeSexHandler,
        GetDsdStabilityStatusByCountyHandler,
        GetDsdStabilityStatusByPartnerHandler,
        GetDsdAppointmentDurationBySexHandler,
        GetDsdAppointmentDurationByAgeHandler,
        GetDsdAppointmentDurationByCountyHandler,
        GetDsdAppointmentDurationByPartnerHandler,
        GetDsdAppointmentDurationCategorizationByStabilityStatusHandler,
        GetTreatmentOutcomesOverallHandler,
        GetTreatmentOutcomesBySexHandler,
        GetTreatmentOutcomesByAgeHandler,
        GetTreatmentOutcomesByYearHandler,
        GetTreatmentOutcomesByCountyHandler,
        GetTreatmentOutcomesByPartnerHandler,
        GetTreatmentOutcomesRetention3mHandler,
        GetTreatmentOutcomesRetention6mHandler,
        GetTreatmentOutcomesRetention12mHandler,
        GetTreatmentOutcomesRetention24mHandler,
        GetDsdAppointmentDurationCategorizationByStabilityStatusHandler,
        GetCtTxCurrAgeGroupDistributionByCountyHandler,
        GetCtTxCurrAgeGroupDistributionByPartnerHandler,
        GetVlOverallUptakeAndSuppressionHandler,
        GetVlUptakeBySexHandler,
        GetVlUptakeByAgeHandler,
        GetVlUptakeByCountyHandler,
        GetVlUptakeByPartnerHandler,
        GetVlOutcomesOverallHandler,
        GetVlOutcomesBySexHandler,
        GetVlSuppressionByAgeHandler,
        GetVlSuppressionByRegimenHandler,
        GetVlSuppressionByYearHandler,
        GetVlSuppressionByCountyHandler,
        GetVlSuppressionByPartnerHandler,
        GetVlOverallUptakeAndSuppressionByFacilityHandler,
        GetVlMedianTimeToFirstVlByYearHandler,
        GetVlMedianTimeToFirstVlByCountyHandler,
        GetVlMedianTimeToFirstVlByPartnerHandler,
    ],
    controllers: [CareTreatmentController]
})
export class CareTreatmentModule {}
