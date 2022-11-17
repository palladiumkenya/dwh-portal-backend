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
import { FactCtTimeToArt } from './new-on-art/entities/fact-ct-time-to-art.model';

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
import { GetTreatmentOutcomesOverallLast12mHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-overall-last-12m.handler';
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
import { GetTreatmentOutcomesUndocumentedByFacilityHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-undocumented-by-facility.handler';

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
import { GetVlOutcomesHvlByFacilityHandler } from './viral-load/queries/handlers/get-vl-outcomes-hvl-by-facility.handler';
import {
    GetVlOverallUptakeAndSuppressionLdlHandler
} from "./viral-load/queries/handlers/get-vl-overall-uptake-and-suppression-ldl.handler";
import {
    GetVlOverallUptakeAndSuppressionReferedLessIntenseHandler
} from "./viral-load/queries/handlers/get-vl-overall-uptake-and-suppression-refered-less-intense.handler";

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
import { GetProportionOfPLHIVWithAeWhoseRegimenChangedHandler } from './adverse-events/queries/handlers/get-proportion-of-plhiv-with-ae-whose-regimen-changed.handler';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedHandler } from './adverse-events/queries/handlers/get-proportion-of-plhiv-with-ae-whose-regimen-was-stopped.handler';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredHandler } from './adverse-events/queries/handlers/get-proportion-of-plhiv-with-ae-whose-regimen-was-not-altered.handler';
import { FactTransVlSuppressionArtStart } from './viral-load/entities/fact-trans-vl-suppression-art-start.model';
import { Get6MonthViralSuppressionByYearOfArtStartHandler } from './viral-load/queries/handlers/get-6-month-viral-suppression-by-year-of-art-start.handler';
import { Get24MonthViralSuppressionByYearOfArtStartHandler } from './viral-load/queries/handlers/get-24-month-viral-suppression-by-year-of-art-start.handler';
import { Get12MonthViralSuppressionByYearOfArtStartHandler } from './viral-load/queries/handlers/get-12-month-viral-suppression-by-year-of-art-start.handler';
import { FactCtTimeToArtLast12M } from './new-on-art/entities/fact-ct-time-to-art-last-12-m.model';
import { GetRegimenDistributionBasedOnWeightBandsHandler } from './art-optimization/queries/handlers/get-regimen-distribution-based-on-weight-bands.handler';
import { GetRegimenDistributionBasedOnAgeBandsHandler } from './art-optimization/queries/handlers/get-regimen-distribution-based-on-age-bands.handler';
import { FactTransOtzEnrollments } from './otz/entities/fact-trans-otz-enrollments.model';
import { GetOtzEnrollmentAmongAlhivAndOnArtBySexHandler } from './otz/queries/handlers/get-otz-enrollment-among-alhiv-and-on-art-by-sex.handler';
import { GetOtzEnrollmentAmongAlhivAndOnArtByAgeHandler } from './otz/queries/handlers/get-otz-enrollment-among-alhiv-and-on-art-by-age.handler';
import { GetOtzEnrollmentAmongAlhivAndOnArtByCountyHandler } from './otz/queries/handlers/get-otz-enrollment-among-alhiv-and-on-art-by-county.handler';
import { GetOtzEnrollmentAmongAlhivAndOnArtByPartnerHandler } from './otz/queries/handlers/get-otz-enrollment-among-alhiv-and-on-art-by-partner.handler';
import { GetVlUptakeAmongAlhivEnrolledInOtzBySexHandler } from './otz/queries/handlers/get-vl-uptake-among-alhiv-enrolled-in-otz-by-sex.handler';
import { GetVlUptakeAmongAlhivEnrolledInOtzByAgeHandler } from './otz/queries/handlers/get-vl-uptake-among-alhiv-enrolled-in-otz-by-age.handler';
import { GetVlUptakeAmongAlhivEnrolledInOtzByCountyHandler } from './otz/queries/handlers/get-vl-uptake-among-alhiv-enrolled-in-otz-by-county.handler';
import { GetVlUptakeAmongAlhivEnrolledInOtzByPartnerHandler } from './otz/queries/handlers/get-vl-uptake-among-alhiv-enrolled-in-otz-by-partner.handler';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingHandler } from './otz/queries/handlers/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training.handler';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyHandler } from './otz/queries/handlers/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-county.handler';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerHandler } from './otz/queries/handlers/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-partner.handler';
import { FactTransOtzOutcome } from './otz/entities/fact-trans-otz-outcome.model';
import { GetOtzOutcomesAmongAlhivWithReSuppressionHandler } from './otz/queries/handlers/get-otz-outcomes-among-alhiv-with-re-suppression.handler';
import { GetOtzOutcomesAmongAlhivWithBaselineVlHandler } from './otz/queries/handlers/get-otz-outcomes-among-alhiv-with-baseline-vl.handler';
import { GetOtzOutcomesAmongAlhivWithSustainedSuppressionHandler } from './otz/queries/handlers/get-otz-outcomes-among-alhiv-with-sustained-suppression.handler';
import { GetOtzOutcomesByGenderHandler } from './otz/queries/handlers/get-otz-outcomes-by-gender.handler';
import { GetOtzOutcomesByPopulationTypeHandler } from './otz/queries/handlers/get-otz-outcomes-by-population-type.handler';
import { GetOtzOutcomesByYearOfArtStartHandler } from './otz/queries/handlers/get-otz-outcomes-by-year-of-art-start.handler';
import { GetOtzOutcomesByPartnerHandler } from './otz/queries/handlers/get-otz-outcomes-by-partner.handler';
import { GetOtzOutcomesByCountyHandler } from './otz/queries/handlers/get-otz-outcomes-by-county.handler';
import { GetOtzAdolescentsHandler } from './otz/queries/handlers/get-otz-adolescents.handler';
import { GetOtzEnrolledHandler } from './otz/queries/handlers/get-otz-enrolled.handler';
import { GetOtzTotalWithVlResultsHandler } from './otz/queries/handlers/get-otz-total-with-vl-results.handler';
import { GetOtzTotalWithVlLessThan1000Handler } from './otz/queries/handlers/get-otz-total-with-vl-less-than-1000.handler';
import { FactTransOvcEnrollments } from './ovc/entities/fact-trans-ovc-enrollments.model';
import { GetOvcOverallOvcServHandler } from './ovc/queries/handlers/get-ovc-overall-ovc-serv.handler';
import { GetOvcServBySexHandler } from './ovc/queries/handlers/get-ovc-serv-by-sex.handler';
import { GetOvcCaregiversRelationshipToOvcClientHandler } from './ovc/queries/handlers/get-ovc-caregivers-relationship-to-ovc-client.handler';
import { GetProportionOfOvcClientsEnrolledInCpimsOverallHandler } from './ovc/queries/handlers/get-proportion-of-ovc-clients-enrolled-in-cpims-overall.handler';
import { GetProportionOfOvcClientsEnrolledInCpimsByGenderHandler } from './ovc/queries/handlers/get-proportion-of-ovc-clients-enrolled-in-cpims-by-gender.handler';
import { GetOvcDistributionByPartnerHandler } from './ovc/queries/handlers/get-ovc-distribution-by-partner.handler';
import { GetOvcDistributionByCountyHandler } from './ovc/queries/handlers/get-ovc-distribution-by-county.handler';
import { GetOvcClientsExitReasonsHandler } from './ovc/queries/handlers/get-ovc-clients-exit-reasons.handler';
import { GetOvcViralSuppressionAmongOvcPatientsGenderHandler } from './ovc/queries/handlers/get-ovc-viral-suppression-among-ovc-patients-gender.handler';
import { GetOvcViralSuppressionAmongOvcPatientsOverallHandler } from './ovc/queries/handlers/get-ovc-viral-suppression-among-ovc-patients-overall.handler';
import { GetMissingDiagnosisDateByFacilityHandler } from './new-on-art/queries/handlers/get-missing-diagnosis-date-by-facility.handler';
import { GetTreatmentOutcomesNetCohortHandler } from './treatment-outcomes/queries/handlers/get-treatment-outcomes-net-cohort.handler';
import { FactTransCohortRetention } from './treatment-outcomes/entities/fact-trans-cohort-retention.model';
import { GetOtzEnrolledAdolescentsByAgeHandler } from './otz/queries/handlers/get-otz-enrolled-adolescents-by-age.handler';
import { GetOtzAdolescentsEnrolledByPartnerHandler } from './otz/queries/handlers/get-otz-adolescents-enrolled-by-partner.handler';
import { GetOtzAdolescentsEnrolledByCountyHandler } from './otz/queries/handlers/get-otz-adolescents-enrolled-by-county.handler';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexHandler } from './otz/queries/handlers/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-sex.handler';
import { GetOtzOutcomesByAgeGroupsHandler } from './otz/queries/handlers/get-otz-outcomes-by-age-groups.handler';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzByAgeHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-age.handler';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-county.handler';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzByPartnerHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-partner.handler';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-sex.handler';
import { GetCovidAdultPLHIVCurrentOnTreatmentHandler } from './covid/queries/handlers/get-covid-adult-plhiv-current-on-treatment.handler';
import { FactTransCovidVaccines } from './covid/entities/fact-trans-covid-vaccines.model';
import { GetCovidPartiallyVaccinatedHandler } from './covid/queries/handlers/get-covid-partially-vaccinated.handler';
import { GetCovidFullyVaccinatedHandler } from './covid/queries/handlers/get-covid-fully-vaccinated.handler';
import { DimAgeGroups } from './common/entities/dim-age-groups.model';
import { GetCovidAdultPLHIVVaccinatedByAgeHandler } from './covid/queries/handlers/get-covid-adult-plhiv-vaccinated-by-age.handler';
import { GetCovidAdultPLHIVVaccinatedByGenderHandler } from './covid/queries/handlers/get-covid-adult-plhiv-vaccinated-by-gender.handler';
import { GetCovidAdultPLHIVVaccinatedByPartnerHandler } from './covid/queries/handlers/get-covid-adult-plhiv-vaccinated-by-partner.handler';
import { GetCovidAdultPLHIVVaccinatedByCountyHandler } from './covid/queries/handlers/get-covid-adult-plhiv-vaccinated-by-county.handler';
import { GetCovidAdultPLHIVCurrentOnTreatmentByGenderHandler } from './covid/queries/handlers/get-covid-adult-plhiv-current-on-treatment-by-gender.handler';
import { GetCovidAdultPLHIVCurrentOnTreatmentByAgeGroupHandler } from './covid/queries/handlers/get-covid-adult-plhiv-current-on-treatment-by-age-group.handler';
import { GetCovidAdultPLHIVCurrentOnTreatmentByCountyHandler } from './covid/queries/handlers/get-covid-adult-plhiv-current-on-treatment-by-county.handler';
import { GetCovidAdultPLHIVCurrentOnTreatmentByPartnerHandler } from './covid/queries/handlers/get-covid-adult-plhiv-current-on-treatment-by-partner.handler';
import { GetCovidPLHIVCurrentOnArtHandler } from './covid/queries/handlers/get-covid-plhiv-current-on-art.handler';
import { GetCovidSeverityByGenderHandler } from './covid/queries/handlers/get-covid-severity-by-gender.handler';
import { GetCovidOverallAdmissionHandler } from './covid/queries/handlers/get-covid-overall-admission.handler';
import { GetCovidOverallAdmissionMalesHandler } from './covid/queries/handlers/get-covid-overall-admission-males.handler';
import { GetCovidOverallAdmissionFemalesHandler } from './covid/queries/handlers/get-covid-overall-admission-females.handler';
import { GetCovidAdmissionByAgeHandler } from './covid/queries/handlers/get-covid-admission-by-age.handler';
import { GetCovidEverHadInfectionHandler } from './covid/queries/handlers/get-covid-ever-had-infection.handler';
import { GetCovidSymptomaticInfectionsHandler } from './covid/queries/handlers/get-covid-symptomatic-infections.handler';
import { GetCovidOverallMissedAppointmentsHandler } from './covid/queries/handlers/get-covid-overall-missed-appointments.handler';
import { GetCovidPercentageWhoMissedAppointmentsByAgeHandler } from './covid/queries/handlers/get-covid-percentage-who-missed-appointments-by-age.handler';
import { GetCovidPercentageWhoMissedAppointmentsByCountyHandler } from './covid/queries/handlers/get-covid-percentage-who-missed-appointments-by-county.handler';
import { GetCovidPercentageWhoMissedAppointmentsByPartnerHandler } from './covid/queries/handlers/get-covid-percentage-who-missed-appointments-by-partner.handler';
import { GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseHandler } from './covid/queries/handlers/get-cumulative-number-adult-plhiv-who-received-atleast-one-dose.handler';
import { GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsHandler } from './covid/queries/handlers/get-covid-trends-of-adult-plhiv-vaccination-in-the-last-12-months.handler';
import { GetOvcOverallCalhivHandler } from './ovc/queries/handlers/get-ovc-overall-calhiv.handler';
import { GetOvcCalHIVByGenderHandler } from './ovc/queries/handlers/get-ovc-cal-hiv-by-gender.handler';
import { GetOvcDistributionOfCalHIVByAgeSexHandler } from './ovc/queries/handlers/get-ovc-distribution-of-calhiv-by-age-sex.handler';
import { GetDistributionOfOvcClientsByAgeSexHandler } from './ovc/queries/handlers/get-distribution-of-ovc-clients-by-age-sex.handler';
import { GetCalhivOnArtHandler } from './ovc/queries/handlers/get-calhiv-on-art.handler';
import { GetCalhivOnDtgNotInOvcHandler } from './ovc/queries/handlers/get-calhiv-on-dtg-not-in-ovc.handler';
import { GetOvcOnArtHandler } from './ovc/queries/handlers/get-ovc-on-art.handler';
import { GetOvcOnDtgHandler } from './ovc/queries/handlers/get-ovc-on-dtg.handler';
import { GetCalhivOnMmdNotInOvcHandler } from './ovc/queries/handlers/get-calhiv-on-mmd-not-in-ovc.handler';
import { GetOvcTotalOnMmdHandler } from './ovc/queries/handlers/get-ovc-total-on-mmd.handler';
import { GetCalhivIitHandler } from './ovc/queries/handlers/get-calhiv-iit.handler';
import { GetCalhivDeadHandler } from './ovc/queries/handlers/get-calhiv-dead.handler';
import { GetOvcIITHandler } from './ovc/queries/handlers/get-ovc-iit.handler';
import { GetCalhivEligibleVlNotInOvcHandler } from './ovc/queries/handlers/get-calhiv-eligible-vl-not-in-ovc.handler';
import { GetCalhivVirallySuppressedNotInOvcHandler } from './ovc/queries/handlers/get-calhiv-virally-suppressed-not-in-ovc.handler';
import { GetCalhivVldoneNotInOvcHandler } from './ovc/queries/handlers/get-calhiv-vldone-not-in-ovc.handler';
import { GetOvcDeadHandler } from './ovc/queries/handlers/get-ovc-dead.handler';
import { GetOvcEligibleVlHandler } from './ovc/queries/handlers/get-ovc-eligible-vl.handler';
import { GetOvcVirallySuppressedHandler } from './ovc/queries/handlers/get-ovc-virally-suppressed.handler';
import { GetOvcVldoneHandler } from './ovc/queries/handlers/get-ovc-vldone.handler';
import { GetOTZCalhivOnArtQuery } from './otz/queries/impl/get-calhiv-on-art.query';
import { GetOTZCalhivOnArtHandler } from './otz/queries/handlers/get-calhiv-on-art.handler';
import { GetOtzCalhivVlEligibleHandler } from './otz/queries/handlers/get-otz-calhiv-vl-eligible.handler';
import { GetCovidNumberScreenedHandler } from './covid/queries/handlers/get-covid-number-screened.handler';
import {
    GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseHandler
} from "./covid/queries/handlers/get-cumulative-number-adult-plhiv-with-missing-date-given-first-dose.handler";
import {
    GetCovidAdmissionSymptomaticOverallHandler
} from "./covid/queries/handlers/get-covid-admission-symptomatic-overall.handler";
import { GetCovidManagementAdmittedHandler } from "./covid/queries/handlers/get-covid-management-admitted.handler";
import { GetCalhivOnArtNotInOvcHandler } from "./ovc/queries/handlers/get-calhiv-on-art-not-in-ovc.handler";
import { GetVlOverallGt1000CopiesHandler } from "./viral-load/queries/handlers/get-vl-overall-gt-1000-copies.handler";
import { GetVlOverallGt1000CopiesReceivedEacHandler } from "./viral-load/queries/handlers/get-vl-overall-gt-1000-copies-received-eac.handler";
import { GetVlOverallUptakeReceivedFollowTestsAllHandler } from "./viral-load/queries/handlers/get-vl-overall-uptake-received-follow-tests-all.handler";
import { GetVlOverallUptakeReceivedFollowTestsHandler } from "./viral-load/queries/handlers/get-vl-overall-uptake-received-follow-tests.handler";
import {
    GetVlOverallNumberWithFollowVlTestsAtGt1000CopiesSecondLineRegimentHandler
} from "./viral-load/queries/handlers/get-vl-overall-number-with-follow-vl-tests-at-gt1000-copies-second-line-regiment.handler";
import { FactNUPI } from './current-on-art/entities/fact-nupi.model';
import { GetCtTxCurrVerifiedHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-verified.handler';
import { GetCtTxCurrVerifiedByCountyHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-verified-by-county.handler';
import { GetCtTxCurrVerifiedByPartnerHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-verified-by-parnter.handler';
import { GetCtTxCurrVerifiedBySexHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-verified-by-sex.handler';
import { GetOtzEnrollmentTrentHandler } from './otz/queries/handlers/get-otz-enrollment-trend.handler';
import { GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexHandler } from './otz/queries/handlers/get-otz-enrollment-among-alhiv-and-on-art-by-age-sex.handler';
import { GetOtzNotEnrolledByPartnerHandler } from './otz/queries/handlers/get-otz-not-enrolled-by-partner.handler';
import { GetOtzNotEnrolledByCountyHandler } from './otz/queries/handlers/get-otz-not-enrolled-by-county.handler';
import { GetAlhivWithReSuppressionHandler } from './otz/queries/handlers/get-alhiv-with-re-suppression.handler';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-age.handler';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzBySexHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-sex.handler';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-partner.handler';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByCountyHandler } from './otz/queries/handlers/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-county.handler';
import { GetCtTxCurrVerifiedByFacilityHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-verified-by-facility.handler';
import { GetCtTxCurrByFacilityHandler } from './current-on-art/queries/handlers/get-ct-tx-curr-by-facility.handler';
import { GetNupiDatasetHandler } from './current-on-art/queries/handlers/get-nupi-dataset.handler';
import { GetCtTxCurrHandler } from './current-on-art/queries/handlers/get-ct-tx-curr.handler';


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
                FactTransAeCausativeDrugs,
                FactTransVlSuppressionArtStart,
                FactCtTimeToArt,
                FactCtTimeToArtLast12M,
                FactTransOtzEnrollments,
                FactTransOtzOutcome,
                FactTransOvcEnrollments,
                FactTransCohortRetention,
                FactTransCovidVaccines,
                DimAgeGroups,
                FactNUPI,
            ],
            'mssql',
        ),
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
        GetTreatmentOutcomesOverallLast12mHandler,
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
        GetTreatmentOutcomesUndocumentedByFacilityHandler,
        GetDsdAppointmentDurationCategorizationByStabilityStatusHandler,
        GetCtTxCurrAgeGroupDistributionByCountyHandler,
        GetCtTxCurrAgeGroupDistributionByPartnerHandler,
        GetVlOverallUptakeAndSuppressionHandler,
        GetVlOverallUptakeAndSuppressionBySexHandler,
        GetVlOverallUptakeAndSuppressionLdlHandler,
        GetVlOverallUptakeAndSuppressionReferedLessIntenseHandler,
        GetVlUptakeBySexHandler,
        GetVlUptakeByAgeHandler,
        GetVlUptakeByCountyHandler,
        GetVlUptakeByPartnerHandler,
        GetVlOutcomesOverallHandler,
        GetVlOutcomesBySexHandler,
        GetVlOutcomesHvlByFacilityHandler,
        GetVlSuppressionByAgeHandler,
        GetVlSuppressionByRegimenHandler,
        GetVlOverallGt1000CopiesHandler,
        GetVlOverallGt1000CopiesReceivedEacHandler,
        GetVlOverallUptakeReceivedFollowTestsAllHandler,
        GetVlOverallUptakeReceivedFollowTestsHandler,
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
        GetProportionOfPLHIVWithAeRelatedToArtHandler,
        GetProportionOfPLHIVWithAeWhoseRegimenChangedHandler,
        GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedHandler,
        GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredHandler,
        Get6MonthViralSuppressionByYearOfArtStartHandler,
        Get12MonthViralSuppressionByYearOfArtStartHandler,
        Get24MonthViralSuppressionByYearOfArtStartHandler,
        GetRegimenDistributionBasedOnWeightBandsHandler,
        GetRegimenDistributionBasedOnAgeBandsHandler,
        GetOtzEnrollmentAmongAlhivAndOnArtBySexHandler,
        GetOtzEnrollmentAmongAlhivAndOnArtByAgeHandler,
        GetOtzEnrollmentAmongAlhivAndOnArtByCountyHandler,
        GetOtzEnrollmentAmongAlhivAndOnArtByPartnerHandler,
        GetVlUptakeAmongAlhivEnrolledInOtzBySexHandler,
        GetVlUptakeAmongAlhivEnrolledInOtzByAgeHandler,
        GetVlUptakeAmongAlhivEnrolledInOtzByCountyHandler,
        GetVlUptakeAmongAlhivEnrolledInOtzByPartnerHandler,
        GetVlOverallNumberWithFollowVlTestsAtGt1000CopiesSecondLineRegimentHandler,
        GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingHandler,
        GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyHandler,
        GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerHandler,
        GetOtzOutcomesAmongAlhivWithReSuppressionHandler,
        GetOtzOutcomesAmongAlhivWithBaselineVlHandler,
        GetOtzOutcomesAmongAlhivWithSustainedSuppressionHandler,
        GetOtzOutcomesByGenderHandler,
        GetOtzOutcomesByPopulationTypeHandler,
        GetOtzOutcomesByYearOfArtStartHandler,
        GetOtzOutcomesByPartnerHandler,
        GetOtzOutcomesByCountyHandler,
        GetOtzAdolescentsHandler,
        GetOtzEnrolledHandler,
        GetOtzTotalWithVlResultsHandler,
        GetOtzTotalWithVlLessThan1000Handler,
        GetOtzEnrollmentTrentHandler,
        GetAlhivWithReSuppressionHandler,
        GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeHandler,
        GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzBySexHandler,
        GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerHandler,
        GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByCountyHandler,
        GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexHandler,
        GetOtzNotEnrolledByPartnerHandler,
        GetOtzNotEnrolledByCountyHandler,
        GetOvcOverallOvcServHandler,
        GetOvcServBySexHandler,
        GetOvcCaregiversRelationshipToOvcClientHandler,
        GetProportionOfOvcClientsEnrolledInCpimsOverallHandler,
        GetProportionOfOvcClientsEnrolledInCpimsByGenderHandler,
        GetOvcDistributionByPartnerHandler,
        GetOvcDistributionByCountyHandler,
        GetOvcClientsExitReasonsHandler,
        GetOvcViralSuppressionAmongOvcPatientsGenderHandler,
        GetOvcViralSuppressionAmongOvcPatientsOverallHandler,
        GetTreatmentOutcomesNetCohortHandler,
        GetMissingDiagnosisDateByFacilityHandler,
        GetOtzEnrolledAdolescentsByAgeHandler,
        GetOtzAdolescentsEnrolledByPartnerHandler,
        GetOtzAdolescentsEnrolledByCountyHandler,
        GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexHandler,
        GetOtzOutcomesByAgeGroupsHandler,
        GetOtzVlSuppressionAmongAlhivEnrolledInOtzByAgeHandler,
        GetOtzVlSuppressionAmongAlhivEnrolledInOtzByCountyHandler,
        GetOtzVlSuppressionAmongAlhivEnrolledInOtzByPartnerHandler,
        GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexHandler,
        GetCovidAdultPLHIVCurrentOnTreatmentHandler,
        GetCovidPartiallyVaccinatedHandler,
        GetCovidFullyVaccinatedHandler,
        GetCovidAdultPLHIVVaccinatedByAgeHandler,
        GetCovidAdultPLHIVVaccinatedByGenderHandler,
        GetCovidAdultPLHIVVaccinatedByPartnerHandler,
        GetCovidAdultPLHIVVaccinatedByCountyHandler,
        GetCovidAdultPLHIVCurrentOnTreatmentByGenderHandler,
        GetCovidAdultPLHIVCurrentOnTreatmentByAgeGroupHandler,
        GetCovidAdultPLHIVCurrentOnTreatmentByCountyHandler,
        GetCovidAdultPLHIVCurrentOnTreatmentByPartnerHandler,
        GetCovidPLHIVCurrentOnArtHandler,
        GetCovidSeverityByGenderHandler,
        GetCovidOverallAdmissionHandler,
        GetCovidOverallAdmissionMalesHandler,
        GetCovidOverallAdmissionFemalesHandler,
        GetCovidAdmissionByAgeHandler,
        GetCovidEverHadInfectionHandler,
        GetCovidSymptomaticInfectionsHandler,
        GetCovidOverallMissedAppointmentsHandler,
        GetCovidPercentageWhoMissedAppointmentsByAgeHandler,
        GetCovidPercentageWhoMissedAppointmentsByCountyHandler,
        GetCovidPercentageWhoMissedAppointmentsByPartnerHandler,
        GetCumulativeNumberAdultPlhivWhoReceivedAtleastOneDoseHandler,
        GetCovidTrendsOfAdultPlhivVaccinationInTheLast12MonthsHandler,
        GetOvcOverallCalhivHandler,
        GetOvcCalHIVByGenderHandler,
        GetOvcDistributionOfCalHIVByAgeSexHandler,
        GetDistributionOfOvcClientsByAgeSexHandler,
        GetCalhivOnArtHandler,
        GetCalhivOnArtNotInOvcHandler,
        GetCalhivOnDtgNotInOvcHandler,
        GetOvcOnArtHandler,
        GetOvcOnDtgHandler,
        GetCalhivOnMmdNotInOvcHandler,
        GetOvcTotalOnMmdHandler,
        GetCalhivIitHandler,
        GetCalhivDeadHandler,
        GetOvcIITHandler,
        GetOvcDeadHandler,
        GetCalhivEligibleVlNotInOvcHandler,
        GetCalhivVirallySuppressedNotInOvcHandler,
        GetCalhivVldoneNotInOvcHandler,
        GetOvcEligibleVlHandler,
        GetOvcVirallySuppressedHandler,
        GetOvcVldoneHandler,
        GetOTZCalhivOnArtHandler,
        GetOtzCalhivVlEligibleHandler,
        GetCovidNumberScreenedHandler,
        GetCumulativeNumberAdultPlhivWithMissingDateGivenFirstDoseHandler,
        GetCovidAdmissionSymptomaticOverallHandler,
        GetCovidManagementAdmittedHandler,
        GetCtTxCurrVerifiedHandler,
        GetCtTxCurrVerifiedByCountyHandler,
        GetCtTxCurrVerifiedByPartnerHandler,
        GetCtTxCurrVerifiedBySexHandler,
        GetCtTxCurrVerifiedByFacilityHandler,
        GetCtTxCurrByFacilityHandler,
        GetNupiDatasetHandler,
        GetCtTxCurrHandler,
    ],
    controllers: [CareTreatmentController],
})
export class CareTreatmentModule {}
