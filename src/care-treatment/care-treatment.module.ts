import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { ConfigurationModule } from '../config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CareTreatmentController } from './care-treatment.controller';

import { AllEmrSites } from './common/entities/all-emr-sites.model';

import { GetCtCountyHandler } from './common/queries/handlers/get-ct-county.handler';
import { GetCtSubCountyHandler } from './common/queries/handlers/get-ct-sub-county.handler';
import { GetCtFacilitiesHandler } from './common/queries/handlers/get-ct-facilities.handler';
import { GetCtPartnersHandler } from './common/queries/handlers/get-ct-partners.handler';
import { GetCtAgenciesHandler } from './common/queries/handlers/get-ct-agencies.handler';
import { GetCtProjectsHandler } from './common/queries/handlers/get-ct-projects.handler';
import { GetCtSitesHandler } from './common/queries/handlers/get-ct-sites.handler';
import { GetCtSiteGpsHandler } from './common/queries/handlers/get-ct-site-gps.handler';

import { FactTransHmisStatsTxcurr } from './home/entities/fact-trans-hmis-stats-txcurr.model';
import { FactTransDsdCascade } from './home/entities/fact-trans-dsd-cascade.model';

import { GetActiveArtHandler } from './home/queries/handlers/get-active-art.handler';
import { GetActiveChildrenHandler } from './home/queries/handlers/get-active-children.handler';
import { GetActiveAdultsHandler } from './home/queries/handlers/get-active-adults.handler';
import { GetActiveArtAdolescentsHandler } from './home/queries/handlers/get-active-art-adolescents.handler';
import { GetActiveArtByGenderHandler } from './home/queries/handlers/get-active-art-by-gender.handler';
import { GetCtTxNewHandler } from './home/queries/handlers/get-ct-tx-new.handler';
import { GetCtStabilityStatusAmongActivePatientsHandler } from './home/queries/handlers/get-ct-stability-status-among-active-patients.handler';
import { GetCtViralLoadCascadeActiveArtClientsHandler } from './home/queries/handlers/get-ct-viral-load-cascade-active-art-clients.handler';
import { GetCtViralLoadSuppressionPercentageHandler } from './home/queries/handlers/get-ct-viral-load-suppression-percentage.handler';

import { GetCtTxCurrAgeGroupDistributionByPartnerHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-age-group-distribution-by-partner.handler';
import { GetCtTxCurrAgeGroupDistributionByCountyHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-age-group-distribution-by-county.handler';
import { GetCtTxCurrByAgeAndSexHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-by-age-and-sex.handler';
import { GetCtTxCurrBySexHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-by-sex.handler';
import { GetCtTxCurrDistributionByCountyHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-distribution-by-county.handler';
import { GetCtTxCurrDistributionByPartnerHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-distribution-by-partner.handler';

import { FactTransNewCohort } from './new-on-art/entities/fact-trans-new-cohort.model';
import { FactTransNewlyStarted } from './new-on-art/entities/fact-trans-newly-started.model';
import { FactCTTimeToArt } from './new-on-art/entities/fact-ct-time-to-art-grp.model';

import { GetTxNewTrendsHandler } from './new-on-art/queries/handlers/get-tx-new-trends.handler';
import { GetTxNewByAgeSexHandler } from './new-on-art/queries/handlers/get-tx-new-by-age-sex.handler';
import { GetTxNewBySexHandler } from './new-on-art/queries/handlers/get-tx-new-by-sex.handler';
import { GetTimeToArtHandler } from './new-on-art/queries/handlers/get-time-to-art.handler';
import { GetTimeToArtFacilitiesHandler } from './new-on-art/queries/handlers/get-time-to-art-facilities.handler';
import { GetMedianTimeToArtByYearHandler } from './new-on-art/queries/handlers/get-median-time-to-art-by-year.handler';
import { GetMedianTimeToArtByCountyHandler } from './new-on-art/queries/handlers/get-median-time-to-art-by-county.handler';
import { GetMedianTimeToArtByPartnerHandler } from './new-on-art/queries/handlers/get-median-time-to-art-by-partner.handler';

import { FactTransDsdUnstable } from './dsd/entities/fact-trans-dsd-unstable.model';
import { FactTransDsdMmdActivePatients } from './dsd/entities/fact-trans-dsd-mmd-active-patients.model';
import { FactTransDsdMmdUptake } from './dsd/entities/fact-trans-dsd-mmd-uptake.model';
import { FactTransDsdStabilityStatus } from './dsd/entities/fact-trans-dsd-stability-status.model';
import { FactTransDsdAppointmentByStabilityStatus } from './dsd/entities/fact-trans-dsd-appointment-by-stability-status.model';

import { GetDsdCascadeHandler } from './dsd/queries/handlers/get-dsd-cascade.handler';
import { GetDsdUnstableHandler } from './dsd/queries/handlers/get-dsd-unstable.handler';
import { GetDsdMmdStableHandler } from './dsd/queries/handlers/get-dsd-mmd-stable.handler';
import { GetDsdStabilityStatusHandler } from './dsd/queries/handlers/get-dsd-stability-status.handler';
import { GetDsdStabilityStatusByAgeSexHandler } from './dsd/queries/handlers/get-dsd-stability-status-by-age-sex.handler';
import { GetDsdStabilityStatusByCountyHandler } from './dsd/queries/handlers/get-dsd-stability-status-by-county.handler';
import { GetDsdStabilityStatusByPartnerHandler } from './dsd/queries/handlers/get-dsd-stability-status-by-partner.handler';
import { GetDsdMmdUptakeOverallHandler } from './dsd/queries/handlers/get-dsd-mmd-uptake-overall.handler';
import { GetDsdMmdUptakeOverallBySexHandler } from './dsd/queries/handlers/get-dsd-mmd-uptake-overall-by-sex.handler';
import { GetDsdAppointmentDurationBySexHandler } from './dsd/queries/handlers/get-dsd-appointment-duration-by-sex.handler';
import { GetDsdAppointmentDurationByAgeHandler } from './dsd/queries/handlers/get-dsd-appointment-duration-by-age.handler';
import { GetDsdAppointmentDurationByCountyHandler } from './dsd/queries/handlers/get-dsd-appointment-duration-by-county.handler';
import { GetDsdAppointmentDurationByPartnerHandler } from './dsd/queries/handlers/get-dsd-appointment-duration-by-partner.handler';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusHandler } from './dsd/queries/handlers/get-dsd-appointment-duration-categorization-by-stability-status.handler';

import { FactTransRetention } from './treatment-outcomes/entities/fact-trans-retention.model';
import { FactTransTreatmentOutcomes } from './treatment-outcomes/entities/fact-trans-treatment-outcomes.model';

import { GetTreatmentOutcomesOverallHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-overall.handler';
import { GetTreatmentOutcomesBySexHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-by-sex.handler';
import { GetTreatmentOutcomesByAgeHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-by-age.handler';
import { GetTreatmentOutcomesByYearHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-by-year.handler';
import { GetTreatmentOutcomesByFacilityHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-by-facility.handler';
import { GetTreatmentOutcomesByCountyHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-by-county.handler';
import { GetTreatmentOutcomesByPartnerHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-by-partner.handler';
import { GetTreatmentOutcomesByPopulationTypeHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-by-population-type.handler';
import { GetTreatmentOutcomesRetention3mHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-retention-3m.handler';
import { GetTreatmentOutcomesRetention6mHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-retention-6m.handler';
import { GetTreatmentOutcomesRetention12mHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-retention-12m.handler';
import { GetTreatmentOutcomesRetention24mHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-retention-24m.handler';

import { FactCTTimeToFirstVL } from './viral-load/entities/fact-ct-time-to-first-vl-grp.model';
import { FactTransVLOutcome } from './viral-load/entities/fact-trans-vl-outcome.model';
import { FactTransVLOverallUptake } from './viral-load/entities/fact-trans-vl-overall-uptake.model';
import { FactTransOptimizeStartRegimen } from './viral-load/entities/fact-trans-optimize-start-regimen.model';

import { GetVlOverallUptakeAndSuppressionHandler } from './viral-load/queries/handlers/get-vl-overall-uptake-and-suppression.handler';
import { GetVlOverallUptakeAndSuppressionBySexHandler } from './viral-load/queries/handlers/get-vl-overall-uptake-and-suppression-by-sex.handler';
import { GetVlUptakeBySexHandler } from './viral-load/queries/handlers/get-vl-uptake-by-sex.handler';
import { GetVlUptakeByAgeHandler } from './viral-load/queries/handlers/get-vl-uptake-by-age.handler';
import { GetVlUptakeByCountyHandler } from './viral-load/queries/handlers/get-vl-uptake-by-county.handler';
import { GetVlUptakeByPartnerHandler } from './viral-load/queries/handlers/get-vl-uptake-by-partner.handler';
import { GetVlOutcomesOverallHandler } from './viral-load/queries/handlers/get-vl-outcomes-overall.handler';
import { GetVlOutcomesBySexHandler } from './viral-load/queries/handlers/get-vl-outcomes-by-sex.handler';
import { GetVlSuppressionByAgeHandler } from './viral-load/queries/handlers/get-vl-suppression-by-age.handler';
import { GetVlSuppressionByRegimenHandler } from './viral-load/queries/handlers/get-vl-suppression-by-regimen.handler';
import { GetVlSuppressionByYearHandler } from './viral-load/queries/handlers/get-vl-suppression-by-year.handler';
import { GetVlSuppressionByYearArtStartHandler } from './viral-load/queries/handlers/get-vl-suppression-by-year-art-start.handler';
import { GetVlSuppressionByCountyHandler } from './viral-load/queries/handlers/get-vl-suppression-by-county.handler';
import { GetVlSuppressionByPartnerHandler } from './viral-load/queries/handlers/get-vl-suppression-by-partner.handler';
import { GetVlOverallUptakeAndSuppressionByFacilityHandler } from './viral-load/queries/handlers/get-vl-overall-uptake-and-suppression-by-facility.handler';
import { GetVlMedianTimeToFirstVlByYearHandler } from './viral-load/queries/handlers/get-vl-median-time-to-first-vl-by-year.handler';
import { GetVlMedianTimeToFirstVlByCountyHandler } from './viral-load/queries/handlers/get-vl-median-time-to-first-vl-by-county.handler';
import { GetVlMedianTimeToFirstVlByPartnerHandler } from './viral-load/queries/handlers/get-vl-median-time-to-first-vl-by-partner.handler';

import { FactTransAdverseEvents } from './adverse-events/entities/fact-trans-adverse-events.model';
import { FactTransAeActionDrug } from './adverse-events/entities/fact-trans-ae-action-drug.model';

import { GetChildrenAdverseEventsHandler } from './adverse-events/queries/handlers/get-children-adverse-events.handler';
import { GetAdultsAdverseEventsHandler } from './adverse-events/queries/handlers/get-adults-adverse-events.handler';
import { GetAdverseEventsHandler } from './adverse-events/queries/handlers/get-adverse-events.handler';
import { GetAdverseEventsClientsHandler } from './adverse-events/queries/handlers/get-adverse-events-clients.handler';
import { FactTransAeSeverity } from './adverse-events/entities/fact-trans-ae-severity.model';
import { GetAeSeverityGradingHandler } from './adverse-events/queries/handlers/get-ae-severity-grading.handler';
import { GetAeActionsBySeverityHandler } from './adverse-events/queries/handlers/get-ae-actions-by-severity.handler';
import { FactTransAeCauses } from './adverse-events/entities/fact-trans-ae-causes.model';
import { GetReportedCausesOfAeHandler } from './adverse-events/queries/handlers/get-reported-causes-of-ae.handler';
import { FactTransAeCategories } from './adverse-events/entities/fact-trans-ae-categories.model';
import { GetReportedAesWithSeverityLevelsHandler } from './adverse-events/queries/handlers/get-reported-aes-with-severity-levels.handler';
import { GetAeActionsByDrugsHandler } from './adverse-events/queries/handlers/get-ae-actions-by-drugs.handler';
import { GetAeActionsByDrugsNewHandler } from './adverse-events/queries/handlers/get-ae-actions-by-drugs-new.handler';
import { GetNumberOfClientChildrenWithAeHandler } from './adverse-events/queries/handlers/get-number-of-client-children-with-ae.handler';
import { FactTransAeClients } from './adverse-events/entities/fact-trans-ae-clients.model';
import { GetNumberOfClientWithAeHandler } from './adverse-events/queries/handlers/get-number-of-client-with-ae.handler';
import { GetNumberAeReportedInAdultsOver15Handler } from './adverse-events/queries/handlers/get-number-ae-reported-in-adults-over-15.handler';
import { GetNumberAeReportedInChildrenOver15Handler } from './adverse-events/queries/handlers/get-number-ae-reported-in-children-over-15.handler';
import { GetAeTypeBySeverityHandler } from './adverse-events/queries/handlers/get-ae-type-by-severity.handler';
import { GetNewlyStartedDesegregatedHandler } from './new-on-art/queries/handlers/get-newly-started-desegregated.handler';

import { FactTransOptimizeRegLines } from './art-optimization/entities/fact-trans-optimize-reg-lines.model';

import { GetArtOptimizationOverviewHandler } from './art-optimization/queries/handlers/get-art-optimization-overview.handler';
import { GetArtOptimizationCurrentByAgeSexHandler } from './art-optimization/queries/handlers/get-art-optimization-current-by-age-sex.handler';
import { GetArtOptimizationCurrentByRegimenHandler } from './art-optimization/queries/handlers/get-art-optimization-current-by-regimen.handler';
import { GetArtOptimizationCurrentByCountyHandler } from './art-optimization/queries/handlers/get-art-optimization-current-by-county.handler';
import { GetArtOptimizationCurrentByPartnerHandler } from './art-optimization/queries/handlers/get-art-optimization-current-by-partner.handler';
import { GetArtOptimizationNewByCountyHandler } from './art-optimization/queries/handlers/get-art-optimization-new-by-county.handler';
import { GetArtOptimizationNewByPartnerHandler } from './art-optimization/queries/handlers/get-art-optimization-new-by-partner.handler';
import { GetArtOptimizationNewByYearHandler } from './art-optimization/queries/handlers/get-art-optimization-new-by-year.handler';
import { GetDsdStableOverallHandler } from './dsd/queries/handlers/get-dsd-stable-overall.handler';
import { GetVlOutcomesByYearAndSuppressionCategoryHandler } from './viral-load/queries/handlers/get-vl-outcomes-by-year-and-suppression-category.handler';
import { FactTimeToVlLast12M } from './viral-load/entities/fact-time-to-vl-last-12m.model';
import { FactTransTimeToVl } from './viral-load/entities/fact-trans-time-to-vl.model';
import { GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsHandler } from './adverse-events/queries/handlers/get-proportion-of-plhiv-on-art-with-ae-by-type-of-suspected-causative-drugs.handler';
import { FactTransAeCausativeDrugs } from './adverse-events/entities/fact-trans-ae-causitive-drugs.model';
import { GetProportionOfPLHIVWithAeRelatedToArtHandler } from './adverse-events/queries/handlers/get-proportion-of-plhiv-with-ae-related-to-art.handler';

@Module({
    imports: [
        CqrsModule,
        ConfigurationModule,
        TypeOrmModule.forFeature(
            [
                AllEmrSites,
                FactTransHmisStatsTxcurr,
                FactTransNewlyStarted,
                FactCTTimeToArt,
                FactTransDsdCascade,
                FactTransDsdUnstable,
                FactTransDsdMmdActivePatients,
                FactTransDsdMmdUptake,
                FactTransDsdStabilityStatus,
                FactTransDsdAppointmentByStabilityStatus,
                FactTransNewCohort,
                FactTransTreatmentOutcomes,
                FactTransRetention,
                FactTransVLOutcome,
                FactTransVLOverallUptake,
                FactTransOptimizeStartRegimen,
                FactCTTimeToFirstVL,
                FactTransAdverseEvents,
                FactTransAeActionDrug,
                FactTransAeSeverity,
                FactTransAeCauses,
                FactTransAeCategories,
                FactTransAeClients,
                FactTransOptimizeRegLines,
                FactTransTimeToVl,
                FactTimeToVlLast12M,
                FactTransAeCausativeDrugs
            ],
            'mssql'
        )
    ],
    providers: [
        GetCtCountyHandler,
        GetCtSubCountyHandler,
        GetCtFacilitiesHandler,
        GetCtPartnersHandler,
        GetCtAgenciesHandler,
        GetCtProjectsHandler,
        GetCtSitesHandler,
        GetCtSiteGpsHandler,
        GetActiveArtHandler,
        GetActiveChildrenHandler,
        GetActiveAdultsHandler,
        GetActiveArtAdolescentsHandler,
        GetActiveArtByGenderHandler,
        GetCtTxNewHandler,
        GetCtStabilityStatusAmongActivePatientsHandler,
        GetCtViralLoadCascadeActiveArtClientsHandler,
        GetCtViralLoadSuppressionPercentageHandler,
        GetCtTxCurrByAgeAndSexHandler,
        GetCtTxCurrBySexHandler,
        GetCtTxCurrDistributionByCountyHandler,
        GetCtTxCurrDistributionByPartnerHandler,
        GetTxNewTrendsHandler,
        GetTxNewByAgeSexHandler,
        GetTxNewBySexHandler,
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
        GetDsdMmdUptakeOverallHandler,
        GetDsdMmdUptakeOverallBySexHandler,
        GetDsdAppointmentDurationBySexHandler,
        GetDsdAppointmentDurationByAgeHandler,
        GetDsdAppointmentDurationByCountyHandler,
        GetDsdAppointmentDurationByPartnerHandler,
        GetDsdAppointmentDurationCategorizationByStabilityStatusHandler,
        GetTreatmentOutcomesOverallHandler,
        GetTreatmentOutcomesBySexHandler,
        GetTreatmentOutcomesByAgeHandler,
        GetTreatmentOutcomesByYearHandler,
        GetTreatmentOutcomesByFacilityHandler,
        GetTreatmentOutcomesByCountyHandler,
        GetTreatmentOutcomesByPartnerHandler,
        GetTreatmentOutcomesByPopulationTypeHandler,
        GetTreatmentOutcomesRetention3mHandler,
        GetTreatmentOutcomesRetention6mHandler,
        GetTreatmentOutcomesRetention12mHandler,
        GetTreatmentOutcomesRetention24mHandler,
        GetDsdAppointmentDurationCategorizationByStabilityStatusHandler,
        GetCtTxCurrAgeGroupDistributionByCountyHandler,
        GetCtTxCurrAgeGroupDistributionByPartnerHandler,
        GetVlOverallUptakeAndSuppressionHandler,
        GetVlOverallUptakeAndSuppressionBySexHandler,
        GetVlUptakeBySexHandler,
        GetVlUptakeByAgeHandler,
        GetVlUptakeByCountyHandler,
        GetVlUptakeByPartnerHandler,
        GetVlOutcomesOverallHandler,
        GetVlOutcomesBySexHandler,
        GetVlSuppressionByAgeHandler,
        GetVlSuppressionByRegimenHandler,
        GetVlSuppressionByYearHandler,
        GetVlSuppressionByYearArtStartHandler,
        GetVlSuppressionByCountyHandler,
        GetVlSuppressionByPartnerHandler,
        GetVlOverallUptakeAndSuppressionByFacilityHandler,
        GetVlMedianTimeToFirstVlByYearHandler,
        GetVlMedianTimeToFirstVlByCountyHandler,
        GetVlMedianTimeToFirstVlByPartnerHandler,
        GetChildrenAdverseEventsHandler,
        GetAdultsAdverseEventsHandler,
        GetAdverseEventsHandler,
        GetAdverseEventsClientsHandler,
        GetAeSeverityGradingHandler,
        GetAeActionsBySeverityHandler,
        GetReportedCausesOfAeHandler,
        GetReportedAesWithSeverityLevelsHandler,
        GetAeActionsByDrugsHandler,
        GetAeActionsByDrugsNewHandler,
        GetNumberOfClientChildrenWithAeHandler,
        GetNumberOfClientWithAeHandler,
        GetNumberAeReportedInAdultsOver15Handler,
        GetNumberAeReportedInChildrenOver15Handler,
        GetAeTypeBySeverityHandler,
        GetNewlyStartedDesegregatedHandler,
        GetArtOptimizationOverviewHandler,
        GetArtOptimizationCurrentByAgeSexHandler,
        GetArtOptimizationCurrentByRegimenHandler,
        GetArtOptimizationCurrentByCountyHandler,
        GetArtOptimizationCurrentByPartnerHandler,
        GetArtOptimizationNewByCountyHandler,
        GetArtOptimizationNewByPartnerHandler,
        GetArtOptimizationNewByYearHandler,
        GetDsdStableOverallHandler,
        GetVlOutcomesByYearAndSuppressionCategoryHandler,
        GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsHandler,
        GetProportionOfPLHIVWithAeRelatedToArtHandler
    ],
    controllers: [CareTreatmentController]
})
export class CareTreatmentModule {}
