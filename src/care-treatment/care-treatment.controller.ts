import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetCtCountyQuery } from './common/queries/impl/get-ct-county.query';
import { GetCtSubCountyQuery } from './common/queries/impl/get-ct-sub-county.query';
import { GetCtFacilitiesQuery } from './common/queries/impl/get-ct-facilities.query';
import { GetCtPartnersQuery } from './common/queries/impl/get-ct-partners.query';
import { GetCtAgenciesQuery } from './common/queries/impl/get-ct-agencies.query';
import { GetCtProjectsQuery } from './common/queries/impl/get-ct-projects.query';
import { GetCtSitesQuery } from './common/queries/impl/get-ct-sites.query';
import { GetCtSiteGpsQuery } from './common/queries/impl/get-ct-site-gps.query';

import { GetActiveArtQuery } from './home/queries/impl/get-active-art.query';
import { GetActiveArtAdultsQuery } from './home/queries/impl/get-active-art-adults.query';
import { GetActiveArtChildrenQuery } from './home/queries/impl/get-active-art-children.query';
import { GetActiveArtAdolescentsQuery } from './home/queries/impl/get-active-art-adolescents.query';
import { GetActiveArtByGenderQuery } from './home/queries/impl/get-active-art-by-gender.query';
import { GetCtTxNewQuery } from './home/queries/impl/get-ct-tx-new.query';
import { GetCtStabilityStatusAmongActivePatientsQuery } from './home/queries/impl/get-ct-stability-status-among-active-patients.query';
import { GetCtViralLoadCascadeActiveArtClientsQuery } from './home/queries/impl/get-ct-viral-load-cascade-active-art-clients.query';
import { GetCtViralLoadSuppressionPercentageQuery } from './home/queries/impl/get-ct-viral-load-suppression-percentage.query';

import { GetCtTxCurrByAgeAndSexQuery } from './current-on-art/queries/impl/get-ct-tx-curr-by-age-and-sex.query';
import { GetCtTxCurrBySexQuery } from './current-on-art/queries/impl/get-ct-tx-curr-by-sex.query';
import { GetCtTxCurrDistributionByCountyQuery } from './current-on-art/queries/impl/get-ct-tx-curr-distribution-by-county.query';
import { GetCtTxCurrDistributionByPartnerQuery } from './current-on-art/queries/impl/get-ct-tx-curr-distribution-by-partner.query';
import { GetCtTxCurrAgeGroupDistributionByCountyQuery } from './current-on-art/queries/impl/get-ct-tx-curr-age-group-distribution-by-county.query';
import { GetCtTxCurrAgeGroupDistributionByPartnerQuery } from './current-on-art/queries/impl/get-ct-tx-curr-age-group-distribution-by-partner.query';

import { GetTxNewTrendsQuery } from './new-on-art/queries/impl/get-tx-new-trends.query';
import { GetTxNewByAgeSexQuery } from './new-on-art/queries/impl/get-tx-new-by-age-sex.query';
import { GetTxNewBySexQuery } from './new-on-art/queries/impl/get-tx-new-by-sex.query';
import { GetMedianTimeToArtByYearQuery } from './new-on-art/queries/impl/get-median-time-to-art-by-year.query';
import { GetMedianTimeToArtByCountyQuery } from './new-on-art/queries/impl/get-median-time-to-art-by-county.query';
import { GetMedianTimeToArtByPartnerQuery } from './new-on-art/queries/impl/get-median-time-to-art-by-partner.query';
import { GetTimeToArtQuery } from './new-on-art/queries/impl/get-time-to-art.query';
import { GetTimeToArtFacilitiesQuery } from './new-on-art/queries/impl/get-time-to-art-facilities.query';

import { GetDsdCascadeQuery } from './dsd/queries/impl/get-dsd-cascade.query';
import { GetDsdUnstableQuery } from './dsd/queries/impl/get-dsd-unstable.query';
import { GetDsdMmdStableQuery } from './dsd/queries/impl/get-dsd-mmd-stable.query';
import { GetDsdStabilityStatusQuery } from './dsd/queries/impl/get-dsd-stability-status.query';
import { GetDsdStabilityStatusByAgeSexQuery } from './dsd/queries/impl/get-dsd-stability-status-by-age-sex.query';
import { GetDsdStabilityStatusByCountyQuery } from './dsd/queries/impl/get-dsd-stability-status-by-county.query';
import { GetDsdStabilityStatusByPartnerQuery } from './dsd/queries/impl/get-dsd-stability-status-by-partner.query';
import { GetDsdMmdUptakeOverallQuery } from './dsd/queries/impl/get-dsd-mmd-uptake-overall.query';
import { GetDsdMmdUptakeOverallBySexQuery } from './dsd/queries/impl/get-dsd-mmd-uptake-overall-by-sex.query';
import { GetDsdAppointmentDurationBySexQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-sex.query';
import { GetDsdAppointmentDurationByAgeQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-age.query';
import { GetDsdAppointmentDurationByCountyQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-county.query';
import { GetDsdAppointmentDurationByPartnerQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-partner.query';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusQuery } from './dsd/queries/impl/get-dsd-appointment-duration-categorization-by-stability-status.query';

import { GetTreatmentOutcomesOverallQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-overall.query';
import { GetTreatmentOutcomesOverallLast12mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-overall-last-12m.query';
import { GetTreatmentOutcomesBySexQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-sex.query';
import { GetTreatmentOutcomesByAgeQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-age.query';
import { GetTreatmentOutcomesByYearQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-year.query';
import { GetTreatmentOutcomesByFacilityQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-facility.query';
import { GetTreatmentOutcomesByCountyQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-county.query';
import { GetTreatmentOutcomesByPartnerQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-partner.query';
import { GetTreatmentOutcomesByPopulationTypeQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-population-type.query';
import { GetTreatmentOutcomesRetention3mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-3m.query';
import { GetTreatmentOutcomesRetention6mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-6m.query';
import { GetTreatmentOutcomesRetention12mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-12m.query';
import { GetTreatmentOutcomesRetention24mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-24m.query';
import { GetTreatmentOutcomesUndocumentedByFacilityQuery }  from './treatment-outcomes/queries/impl/get-treatment-outcomes-undocumented-by-facility.query';

import { GetVlOverallUptakeAndSuppressionQuery } from './viral-load/queries/impl/get-vl-overall-uptake-and-suppression.query';
import { GetVlOverallUptakeAndSuppressionBySexQuery } from './viral-load/queries/impl/get-vl-overall-uptake-and-suppression-by-sex.query';
import { GetVlUptakeBySexQuery } from './viral-load/queries/impl/get-vl-uptake-by-sex.query';
import { GetVlUptakeByAgeQuery } from './viral-load/queries/impl/get-vl-uptake-by-age.query';
import { GetVlUptakeByCountyQuery } from './viral-load/queries/impl/get-vl-uptake-by-county.query';
import { GetVlUptakeByPartnerQuery } from './viral-load/queries/impl/get-vl-uptake-by-partner.query';
import { GetVlOutcomesOverallQuery } from './viral-load/queries/impl/get-vl-outcomes-overall.query';
import { GetVlOutcomesBySexQuery } from './viral-load/queries/impl/get-vl-outcomes-by-sex.query';
import { GetVlSuppressionByAgeQuery } from './viral-load/queries/impl/get-vl-suppression-by-age.query';
import { GetVlSuppressionByRegimenQuery } from './viral-load/queries/impl/get-vl-suppression-by-regimen.query';
import { GetVlSuppressionByYearQuery } from './viral-load/queries/impl/get-vl-suppression-by-year.query';
import { GetVlSuppressionByYearArtStartQuery } from './viral-load/queries/impl/get-vl-suppression-by-year-art-start.query';
import { GetVlSuppressionByCountyQuery } from './viral-load/queries/impl/get-vl-suppression-by-county.query';
import { GetVlSuppressionByPartnerQuery } from './viral-load/queries/impl/get-vl-suppression-by-partner.query';
import { GetVlOverallUptakeAndSuppressionByFacilityQuery } from './viral-load/queries/impl/get-vl-overall-uptake-and-suppression-by-facility.query';
import { GetVlMedianTimeToFirstVlByYearQuery } from './viral-load/queries/impl/get-vl-median-time-to-first-vl-by-year.query';
import { GetVlMedianTimeToFirstVlByCountyQuery } from './viral-load/queries/impl/get-vl-median-time-to-first-vl-by-county.query';
import { GetVlMedianTimeToFirstVlByPartnerQuery } from './viral-load/queries/impl/get-vl-median-time-to-first-vl-by-partner.query';
import { GetVlOutcomesByYearAndSuppressionCategoryQuery } from './viral-load/queries/impl/get-vl-outcomes-by-year-and-suppression-category.query';
import { GetVlOutcomesHvlByFacilityQuery } from './viral-load/queries/impl/get-vl-outcomes-hvl-by-facility.query';

import { GetAdverseEventsQuery } from './adverse-events/queries/impl/get-adverse-events.query';
import { GetAdverseEventsClientsQuery } from './adverse-events/queries/impl/get-adverse-events-clients.query';
import { GetChildrenAdverseEventsQuery } from './adverse-events/queries/impl/get-children-adverse-events.query';
import { GetAdultsAdverseEventsQuery } from './adverse-events/queries/impl/get-adults-adverse-events.query';
import { GetAeSeverityGradingQuery } from './adverse-events/queries/impl/get-ae-severity-grading.query';
import { GetAeActionsBySeverityQuery } from './adverse-events/queries/impl/get-ae-actions-by-severity.query';
import { GetReportedCausesOfAeQuery } from './adverse-events/queries/impl/get-reported-causes-of-ae.query';
import { GetReportedAesWithSeverityLevelsQuery } from './adverse-events/queries/impl/get-reported-aes-with-severity-levels.query';
import { GetAeActionsByDrugsQuery } from './adverse-events/queries/impl/get-ae-actions-by-drugs.query';
import { GetAeActionsByDrugsNewQuery } from './adverse-events/queries/impl/get-ae-actions-by-drugs-new.query';
import { GetNumberOfClientWithAeQuery } from './adverse-events/queries/impl/get-number-of-client-with-ae.query';
import { GetNumberOfClientChildrenWithAeQuery } from './adverse-events/queries/impl/get-number-of-client-children-with-ae.query';
import { GetNumberAeReportedInAdultsOver15Query } from './adverse-events/queries/impl/get-number-ae-reported-in-adults-over-15.query';
import { GetNumberAeReportedInChildrenOver15Query } from './adverse-events/queries/impl/get-number-ae-reported-in-children-over-15.query';
import { GetAeTypeBySeverityQuery } from './adverse-events/queries/impl/get-ae-type-by-severity.query';
import { GetNewlyStartedDesegregatedQuery } from './new-on-art/queries/impl/get-newly-started-desegregated.query';

import { GetArtOptimizationOverviewQuery } from './art-optimization/queries/impl/get-art-optimization-overview.query';
import { GetArtOptimizationCurrentByAgeSexQuery } from './art-optimization/queries/impl/get-art-optimization-current-by-age-sex.query';
import { GetArtOptimizationCurrentByRegimenQuery } from './art-optimization/queries/impl/get-art-optimization-current-by-regimen.query';
import { GetArtOptimizationCurrentByCountyQuery } from './art-optimization/queries/impl/get-art-optimization-current-by-county.query';
import { GetArtOptimizationCurrentByPartnerQuery } from './art-optimization/queries/impl/get-art-optimization-current-by-partner.query';
import { GetArtOptimizationNewByCountyQuery } from './art-optimization/queries/impl/get-art-optimization-new-by-county.query';
import { GetArtOptimizationNewByPartnerQuery } from './art-optimization/queries/impl/get-art-optimization-new-by-partner.query';
import { GetArtOptimizationNewByYearQuery } from './art-optimization/queries/impl/get-art-optimization-new-by-year.query';
import { GetDsdStableOverallQuery } from './dsd/queries/impl/get-dsd-stable-overall.query';
import { GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery } from './adverse-events/queries/impl/get-proportion-of-plhiv-on-art-with-ae-by-type-of-suspected-causative-drugs.query';
import { GetProportionOfPLHIVWithAeRelatedToArtQuery } from './adverse-events/queries/impl/get-proportion-of-plhiv-with-ae-related-to-art.query';
import { GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery } from './adverse-events/queries/impl/get-proportion-of-plhiv-with-ae-whose-regimen-changed.query';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery } from './adverse-events/queries/impl/get-proportion-of-plhiv-with-ae-whose-regimen-was-stopped.query';
import { GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery } from './adverse-events/queries/impl/get-proportion-of-plhiv-with-ae-whose-regimen-was-not-altered.query';
import { Get6MonthViralSuppressionByYearOfArtStartQuery } from './viral-load/queries/impl/get-6-month-viral-suppression-by-year-of-art-start.query';
import { Get12MonthViralSuppressionByYearOfArtStartQuery } from './viral-load/queries/impl/get-12-month-viral-suppression-by-year-of-art-start.query';
import { Get24MonthViralSuppressionByYearOfArtStartQuery } from './viral-load/queries/impl/get-24-month-viral-suppression-by-year-of-art-start.query';
import { GetRegimenDistributionBasedOnWeightBandsQuery } from './art-optimization/queries/impl/get-regimen-distribution-based-on-weight-bands.query';
import { GetRegimenDistributionBasedOnAgeBandsQuery } from './art-optimization/queries/impl/get-regimen-distribution-based-on-age-bands.query';
import { GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery } from './otz/queries/impl/get-otz-enrollment-among-alhiv-and-on-art-by-sex.query';
import { GetOtzEnrollmentAmongAlhivAndOnArtByAgeQuery } from './otz/queries/impl/get-otz-enrollment-among-alhiv-and-on-art-by-age.query';
import { GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery } from './otz/queries/impl/get-otz-enrollment-among-alhiv-and-on-art-by-county.query';
import { GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery } from './otz/queries/impl/get-otz-enrollment-among-alhiv-and-on-art-by-partner.query';
import { GetVlUptakeAmongAlhivEnrolledInOtzBySexQuery } from './otz/queries/impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-sex.query';
import { GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery } from './otz/queries/impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-age.query';
import { GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery } from './otz/queries/impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-county.query';
import { GetVlUptakeAmongAlhivEnrolledInOtzByPartnerQuery } from './otz/queries/impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-partner.query';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery } from './otz/queries/impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training.query';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery } from './otz/queries/impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-county.query';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery } from './otz/queries/impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-partner.query';
import { GetOtzOutcomesAmongAlhivWithBaselineVlQuery } from './otz/queries/impl/get-otz-outcomes-among-alhiv-with-baseline-vl.query';
import { GetOtzOutcomesAmongAlhivWithReSuppressionQuery } from './otz/queries/impl/get-otz-outcomes-among-alhiv-with-re-suppression.query';
import { GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery } from './otz/queries/impl/get-otz-outcomes-among-alhiv-with-sustained-suppression.query';
import { GetOtzOutcomesByGenderQuery } from './otz/queries/impl/get-otz-outcomes-by-gender.query';
import { GetOtzOutcomesByPopulationTypeQuery } from './otz/queries/impl/get-otz-outcomes-by-population-type.query';
import { GetOtzOutcomesByYearOfArtStartQuery } from './otz/queries/impl/get-otz-outcomes-by-year-of-art-start.query';
import { GetOtzOutcomesByCountyQuery } from './otz/queries/impl/get-otz-outcomes-by-county.query';
import { GetOtzOutcomesByPartnerQuery } from './otz/queries/impl/get-otz-outcomes-by-partner.query';
import { GetOtzAdolescentsQuery } from './otz/queries/impl/get-otz-adolescents.query';
import { GetOtzEnrolledQuery } from './otz/queries/impl/get-otz-enrolled.query';
import { GetOtzTotalWithVlResultsQuery } from './otz/queries/impl/get-otz-total-with-vl-results.query';
import { GetOtzTotalWithVlLessThan1000Query } from './otz/queries/impl/get-otz-total-with-vl-less-than-1000.query';
import { GetOvcOverallOvcServQuery } from './ovc/queries/impl/get-ovc-overall-ovc-serv.query';
import { GetOvcServBySexQuery } from './ovc/queries/impl/get-ovc-serv-by-sex.query';
import { GetOvcCaregiversRelationshipToOvcClientQuery } from './ovc/queries/impl/get-ovc-caregivers-relationship-to-ovc-client.query';
import { GetProportionOfOvcClientsEnrolledInCpimsOverallQuery } from './ovc/queries/impl/get-proportion-of-ovc-clients-enrolled-in-cpims-overall.query';
import { GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery } from './ovc/queries/impl/get-proportion-of-ovc-clients-enrolled-in-cpims-by-gender.query';
import { GetOvcDistributionByCountyQuery } from './ovc/queries/impl/get-ovc-distribution-by-county.query';
import { GetOvcDistributionByPartnerQuery } from './ovc/queries/impl/get-ovc-distribution-by-partner.query';
import { GetOvcClientsExitReasonsQuery } from './ovc/queries/impl/get-ovc-clients-exit-reasons.query';
import { GetOvcViralSuppressionAmongOvcPatientsOverallQuery } from './ovc/queries/impl/get-ovc-viral-suppression-among-ovc-patients-overall.query';
import { GetOvcViralSuppressionAmongOvcPatientsGenderQuery } from './ovc/queries/impl/get-ovc-viral-suppression-among-ovc-patients-gender.query';

import { GetMissingDiagnosisDateByFacilityQuery } from './new-on-art/queries/impl/get-missing-diagnosis-date-by-facility.query';
import { GetTreatmentOutcomesNetCohortQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-net-cohort.query';
import { GetOtzEnrolledAdolescentsByAgeQuery } from './otz/queries/impl/get-otz-enrolled-adolescents-by-age.query';
import { GetOtzAdolescentsEnrolledByCountyQuery } from './otz/queries/impl/get-otz-adolescents-enrolled-by-county.query';
import { GetOtzAdolescentsEnrolledByPartnerQuery } from './otz/queries/impl/get-otz-adolescents-enrolled-by-partner.query';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery } from './otz/queries/impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-sex.query';

@Controller('care-treatment')
export class CareTreatmentController {
    constructor(private readonly queryBus: QueryBus) {

    }

    @Get('counties')
    async getCounties(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project
    ): Promise<any> {
        const query = new GetCtCountyQuery();
        if(county) {
            query.county = county;
        }
        if(subCounty) {
            query.subCounty = subCounty;
        }
        if(facility) {
            query.facility = facility;
        }
        if(partner) {
            query.partner = partner;
        }
        if(agency) {
            query.agency = agency;
        }
        if(project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('subCounties')
    async getSubCounties(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project
    ): Promise<any> {
        const query = new GetCtSubCountyQuery();
        if(county) {
            query.county = county;
        }
        if(subCounty) {
            query.subCounty = subCounty;
        }
        if(facility) {
            query.facility = facility;
        }
        if(partner) {
            query.partner = partner;
        }
        if(agency) {
            query.agency = agency;
        }
        if(project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('facilities')
    async getFacilities(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project
    ): Promise<any> {
        const query = new GetCtFacilitiesQuery();
        if(county) {
            query.county = county;
        }
        if(subCounty) {
            query.subCounty = subCounty;
        }
        if(facility) {
            query.facility = facility;
        }
        if(partner) {
            query.partner = partner;
        }
        if(agency) {
            query.agency = agency;
        }
        if(project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('sites')
    async getSites(): Promise<any> {
        return this.queryBus.execute(new GetCtSitesQuery());
    }

    @Get('siteGps')
    async getSiteGps(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project
    ): Promise<any> {
        const query = new GetCtSiteGpsQuery();
        if(county) {
            query.county = county;
        }
        if(subCounty) {
            query.subCounty = subCounty;
        }
        if(facility) {
            query.facility = facility;
        }
        if(partner) {
            query.partner = partner;
        }
        if(agency) {
            query.agency = agency;
        }
        if(project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('partners')
    async getPartners(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project
    ): Promise<any> {
        const query = new GetCtPartnersQuery();
        if(county) {
            query.county = county;
        }
        if(subCounty) {
            query.subCounty = subCounty;
        }
        if(facility) {
            query.facility = facility;
        }
        if(partner) {
            query.partner = partner;
        }
        if(agency) {
            query.agency = agency;
        }
        if(project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('agencies')
    async getAgencies(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project
    ): Promise<any> {
        const query = new GetCtAgenciesQuery();
        if(county) {
            query.county = county;
        }
        if(subCounty) {
            query.subCounty = subCounty;
        }
        if(facility) {
            query.facility = facility;
        }
        if(partner) {
            query.partner = partner;
        }
        if(agency) {
            query.agency = agency;
        }
        if(project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('projects')
    async getProjects(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project
    ): Promise<any> {
        const query = new GetCtProjectsQuery();
        if(county) {
            query.county = county;
        }
        if(subCounty) {
            query.subCounty = subCounty;
        }
        if(facility) {
            query.facility = facility;
        }
        if(partner) {
            query.partner = partner;
        }
        if(agency) {
            query.agency = agency;
        }
        if(project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('activeArt')
    async getActiveClientsOnArt(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetActiveArtQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('activeArtChildren')
    async getActiveClientsOnArtChildren(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetActiveArtChildrenQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('activeArtAdults')
    async getActiveClientsOnArtAdults(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetActiveArtAdultsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('activeArtAdolescents')
    async getActiveClientsOnArtAdolescents(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetActiveArtAdolescentsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('activeArtByGender')
    async getActiveClientsByGender(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetActiveArtByGenderQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('txNew')
    async getTxNew(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetCtTxNewQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('stabilityStatus')
    async getStabilityStatus(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetCtStabilityStatusAmongActivePatientsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('viralLoadSuppressionPercentageByGender')
    async getViralLoadSuppressionPercentageByGender(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetCtViralLoadSuppressionPercentageQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('viralLoadCascade')
    async getViralLoadCascade(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetCtViralLoadCascadeActiveArtClientsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('txCurrByAgeAndSex')
    async getTxCurrByAgeAndSex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetCtTxCurrByAgeAndSexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('txCurrBySex')
    async getTxCurrBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetCtTxCurrBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('txNewTrends')
    async getTxNewTrends(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTxNewTrendsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('txNewByAgeSex')
    async getTxNewByAgeSex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTxNewByAgeSexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('txNewBySex')
    async getTxNewBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTxNewBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('medianTimeToArtByYear')
    async getMedianTimeToArtByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetMedianTimeToArtByYearQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('medianTimeToArtByCounty')
    async getMedianTimeToArtByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetMedianTimeToArtByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('medianTimeToArtByPartner')
    async getMedianTimeToArtByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetMedianTimeToArtByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('timeToArt')
    async getTimeToArt(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTimeToArtQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('timeToArtFacilities')
    async getTimeToArtFacilities(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTimeToArtFacilitiesQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('txCurrDistributionByCounty')
    async getTxCurrDistributionByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetCtTxCurrDistributionByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('txCurrDistributionByPartner')
    async getTxCurrDistributionByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetCtTxCurrDistributionByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdCascade')
    async getDsdCascade(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdCascadeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdUnstable')
    async getDsdUnstable(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdUnstableQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdMmdStable')
    async getDsdMmdStable(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdMmdStableQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('getDsdStableOverall')
    async getDsdStableOverall(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdStableOverallQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdStabilityStatus')
    async getDsdStabilityStatus(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdStabilityStatusQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdStabilityStatusByAgeSex')
    async getDsdStabilityStatusByAgeSex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdStabilityStatusByAgeSexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdStabilityStatusByCounty')
    async getDsdStabilityStatusByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdStabilityStatusByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdStabilityStatusByPartner')
    async getDsdStabilityStatusByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdStabilityStatusByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdMmdUptakeOverall')
    async getDsdMmdUptakeOverall(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdMmdUptakeOverallQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdMmdUptakeOverallBySex')
    async getDsdMmdUptakeOverallBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdMmdUptakeOverallBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdAppointmentDurationBySex')
    async getDsdAppointmentDurationBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdAppointmentDurationBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdAppointmentDurationByAge')
    async getDsdAppointmentDurationByAge(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdAppointmentDurationByAgeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdAppointmentDurationByCounty')
    async getDsdAppointmentDurationByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdAppointmentDurationByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('dsdAppointmentDurationByPartner')
    async getDsdAppointmentDurationByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetDsdAppointmentDurationByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('getDsdAppointmentCategorizationByStabilityStatus')
    async getDsdAppointmentCategorizationByStabilityStatus(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetDsdAppointmentDurationCategorizationByStabilityStatusQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesOverall')
    async getTreatmentOutcomesOverall(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesOverallQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesNetCohort')
    async getTreatmentOutcomesNetCohort(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesNetCohortQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesOverallLast12m')
    async getTreatmentOutcomesOverallLast12m(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesOverallLast12mQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesBySex')
    async getTreatmentOutcomesBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByAge')
    async getTreatmentOutcomesByAge(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesByAgeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByYear')
    async getTreatmentOutcomesByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesByYearQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByFacility')
    async getTreatmentOutcomesByFacility(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesByFacilityQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByCounty')
    async getTreatmentOutcomesByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByPartner')
    async getTreatmentOutcomesByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByPopulationType')
    async getTreatmentOutcomesByPopulationType(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesByPopulationTypeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(fromDate) {
            query.fromDate = fromDate;
        }

        if(toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesRetention3m')
    async getTreatmentOutcomesRetention3m(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesRetention3mQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesRetention6m')
    async getTreatmentOutcomesRetention6m(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesRetention6mQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesRetention12m')
    async getTreatmentOutcomesRetention12m(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesRetention12mQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesRetention24m')
    async getTreatmentOutcomesRetention24m(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetTreatmentOutcomesRetention24mQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesUndocumentedByFacility')
    async treatmentOutcomesUndocumentedByFacility(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetTreatmentOutcomesUndocumentedByFacilityQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    

    @Get('missingDiagnosisDateByFacility')
    async missingDiagnosisDateByFacility(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetMissingDiagnosisDateByFacilityQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getTxCurrAgeGroupDistributionByCounty')
    async getTxCurrAgeGroupDistributionByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetCtTxCurrAgeGroupDistributionByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getTxCurrAgeGroupDistributionByPartner')
    async getTxCurrAgeGroupDistributionByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetCtTxCurrAgeGroupDistributionByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlOverallUptakeAndSuppression')
    async getVlOverallUptakeAndSuppression(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlOverallUptakeAndSuppressionQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlOverallUptakeAndSuppressionBySex')
    async getVlOverallUptakeAndSuppressionBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlOverallUptakeAndSuppressionBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlUptakeBySex')
    async getVlUptakeBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlUptakeBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlUptakeByAge')
    async getVlUptakeByAge(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlUptakeByAgeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlUptakeByCounty')
    async getVlUptakeByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlUptakeByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlUptakeByPartner')
    async getVlUptakeByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlUptakeByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlOutcomesOverall')
    async getVlOutcomesOverall(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlOutcomesOverallQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlOutcomesBySex')
    async getVlOutcomesBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlOutcomesBySexQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlSuppressionByAge')
    async getVlSuppressionByAge(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlSuppressionByAgeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlSuppressionByRegimen')
    async getVlSuppressionByRegimen(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlSuppressionByRegimenQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlSuppressionByYear')
    async getVlSuppressionByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlSuppressionByYearQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlSuppressionByYearArtStart')
    async getVlSuppressionByYearArtStart(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlSuppressionByYearArtStartQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('getVlSuppressionByYearAndSuppressionCategory')
    async getVlSuppressionByYearAndSuppressionCategory(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlOutcomesByYearAndSuppressionCategoryQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('getVlOutcomesHvlByFacility')
    async getVlOutcomesHvlByFacility(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetVlOutcomesHvlByFacilityQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlSuppressionByCounty')
    async getVlSuppressionByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlSuppressionByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlSuppressionByPartner')
    async getVlSuppressionByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlSuppressionByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlOverallUptakeAndSuppressionByFacility')
    async getVlOverallUptakeAndSuppressionByFacility(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlOverallUptakeAndSuppressionByFacilityQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlMedianTimeToFirstVlByYear')
    async getVlMedianTimeToFirstVlByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlMedianTimeToFirstVlByYearQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlMedianTimeToFirstVlByCounty')
    async getVlMedianTimeToFirstVlByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlMedianTimeToFirstVlByCountyQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('vlMedianTimeToFirstVlByPartner')
    async getVlMedianTimeToFirstVlByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetVlMedianTimeToFirstVlByPartnerQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('getChildrenAdverseEvents')
    async getChildrenAdverseEvents(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetChildrenAdverseEventsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getAdultsAdverseEvents')
    async getAdultsAdverseEvents(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAdultsAdverseEventsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getAdverseEvents')
    async getAdverseEvents(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAdverseEventsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getAdverseEventsClients')
    async getAdverseEventsClients(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAdverseEventsClientsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }


    @Get('getAeSeverityGrading')
    async getAeSeverityGrading(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAeSeverityGradingQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getAeActionsBySeverity')
    async getAeActionsBySeverity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAeActionsBySeverityQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getReportedCausesOfAes')
    async getReportedCausesOfAes(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetReportedCausesOfAeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getReportedAesWithSeverityLevels')
    async getReportedAesWithSeverityLevels(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetReportedAesWithSeverityLevelsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getAeActionsByDrugs')
    async getAeActionsByDrugs(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAeActionsByDrugsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getAeActionsByDrugsNew')
    async getAeActionsByDrugsNew(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAeActionsByDrugsNewQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getNoOfReportedAeInAdults')
    async getNoOfReportedAeInAdults(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetNumberAeReportedInAdultsOver15Query();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getNoOfReportedAeInChildren')
    async getNoOfReportedAeInChildren(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetNumberAeReportedInChildrenOver15Query();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getNumberOfAdultsWithAe')
    async getNumberOfAdultsWithAe(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetNumberOfClientWithAeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getNumberOfChildrenWithAe')
    async getNumberOfChildrenWithAe(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetNumberOfClientChildrenWithAeQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getAeTypesBySeverity')
    async getAeTypesBySeverity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetAeTypeBySeverityQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionOfPLHIVWithAeByTypeOfSuspectedDrugs')
    async getProportionOfPLHIVWithAeByTypeOfSuspectedDrugs(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetProportionOfPlHIVOnArtWithAeByTypeOfSuspectedCausativeDrugsQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionOfPLHIVWithAeRelatedToArt')
    async getProportionOfPLHIVWithAeRelatedToArt(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetProportionOfPLHIVWithAeRelatedToArtQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getNewlyStartedDesegregated')
    async getNewlyStartedDesegregated(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month
    ): Promise<any> {
        const query = new GetNewlyStartedDesegregatedQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationOverview')
    async getArtOptimizationOverview(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationOverviewQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationCurrentByAgeSex')
    async getArtOptimizationCurrentByAgeSex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationCurrentByAgeSexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationCurrentByRegimen')
    async getArtOptimizationCurrentByRegimen(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationCurrentByRegimenQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationCurrentByCounty')
    async getArtOptimizationCurrentByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationCurrentByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationCurrentByPartner')
    async getArtOptimizationCurrentByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationCurrentByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationNewByCounty')
    async getArtOptimizationNewByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationNewByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationNewByPartner')
    async getArtOptimizationNewByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationNewByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getArtOptimizationNewByYear')
    async getArtOptimizationNewByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetArtOptimizationNewByYearQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionOfPLHIVWithAeWhoseRegimenChanged')
    async getProportionOfPLHIVWithAeWhoseRegimenChanged(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetProportionOfPLHIVWithAeWhoseRegimenChangedQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionOfPLHIVWithAeWhoseRegimenWasStopped')
    async getProportionOfPLHIVWithAeWhoseRegimenWasStopped(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetProportionOfPLHIVWithAeWhoseRegimenWasStoppedQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionOfPLHIVWithAeWhoseRegimenWasNotAltered')
    async getProportionOfPLHIVWithAeWhoseRegimenWasNotAltered(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new GetProportionOfPLHIVWithAeWhoseRegimenWasNotAlteredQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('get6MonthViralSuppressionByYearOfArtStart')
    async get6MonthViralSuppressionByYearOfArtStart(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new Get6MonthViralSuppressionByYearOfArtStartQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('get12MonthViralSuppressionByYearOfArtStart')
    async get12MonthViralSuppressionByYearOfArtStart(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new Get12MonthViralSuppressionByYearOfArtStartQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('get24MonthViralSuppressionByYearOfArtStart')
    async get24MonthViralSuppressionByYearOfArtStart(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner
    ): Promise<any> {
        const query = new Get24MonthViralSuppressionByYearOfArtStartQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        return this.queryBus.execute(query);
    }

    @Get('getRegimenDistributionByWeightBands')
    async getRegimenDistributionByWeightBands(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetRegimenDistributionBasedOnWeightBandsQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getRegimenDistributionByAgeBands')
    async getRegimenDistributionByAgeBands(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
        @Query('populationType') populationType,
        @Query('latestPregnancy') latestPregnancy 
    ): Promise<any> {
        const query = new GetRegimenDistributionBasedOnAgeBandsQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        if (populationType) {
            query.populationType = populationType;
        }

        if (latestPregnancy) {
            query.latestPregnancy = latestPregnancy;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzEnrollmentsBySex')
    async getOtzEnrollmentsBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzEnrollmentAmongAlhivAndOnArtBySexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzAdolescentsByAgeGroup')
    async getOtzAdolescentsByAgeGroup(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzEnrolledAdolescentsByAgeQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzEnrollmentsByAge')
    async getOtzEnrollmentsByAge(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzEnrollmentAmongAlhivAndOnArtByAgeQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzAdolescentsEnrolledByCounty')
    async getOtzAdolescentsEnrolledByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzAdolescentsEnrolledByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzEnrollmentsByCounty')
    async getOtzEnrollmentsByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzEnrollmentAmongAlhivAndOnArtByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzAdolescentsEnrolledByPartner')
    async getOtzAdolescentsEnrolledByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzAdolescentsEnrolledByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzEnrollmentsByPartner')
    async getOtzEnrollmentsByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getVlUptakeAmongAlHivEnrolledInOtzBySex')
    async getVlUptakeAmongAlHivEnrolledInOtzBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetVlUptakeAmongAlhivEnrolledInOtzBySexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }



    @Get('getVlUptakeAmongAlHivEnrolledInOtzByAge')
    async getVlUptakeAmongAlHivEnrolledInOtzByAge(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getVlUptakeAmongAlHivEnrolledInOtzByCounty')
    async getVlUptakeAmongAlHivEnrolledInOtzByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getVlUptakeAmongAlHivEnrolledInOtzByPartner')
    async getVlUptakeAmongAlHivEnrolledInOtzByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetVlUptakeAmongAlhivEnrolledInOtzByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getProportionOfAlHivWhoCompletedTraining')
    async getProportionOfAlHivWhoCompletedTraining(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionOfAlHivWhoCompletedTrainingByCounty')
    async getProportionOfAlHivWhoCompletedTrainingByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getProportionOfAlHivWhoCompletedTrainingByPartner')
    async getProportionOfAlHivWhoCompletedTrainingByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzOutcomesAmongAlHivWithBaselineVL')
    async getOtzOutcomesAmongAlHivWithBaselineVL(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesAmongAlhivWithBaselineVlQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getOtzOutcomesAmongAlHivWithReSuppression')
    async getOtzOutcomesAmongAlHivWithReSuppression(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesAmongAlhivWithReSuppressionQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzOutcomesAmongAlHivWithSustainedSuppression')
    async getOtzOutcomesAmongAlHivWithSustainedSuppression(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesAmongAlhivWithSustainedSuppressionQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzOutcomesByGender')
    async getOtzOutcomesByGender(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesByGenderQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzOutcomesByPopulationType')
    async getOtzOutcomesByPopulationType(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesByPopulationTypeQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getOtzOutcomesByYearOfArtStart')
    async getOtzOutcomesByYearOfArtStart(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesByYearOfArtStartQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzOutcomesByCounty')
    async getOtzOutcomesByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getOtzOutcomesByPartner')
    async getOtzOutcomesByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzOutcomesByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzTotalAdolescents')
    async getOtzTotalAdolescents(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzAdolescentsQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOtzEnrolled')
    async getOtzEnrolled(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzEnrolledQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getTotalWithVLResults')
    async getTotalWithVLResults(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzTotalWithVlResultsQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getTotalOtzTotalWithVLResultsLessThan1000')
    async getTotalOtzTotalWithVLResultsLessThan1000(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOtzTotalWithVlLessThan1000Query();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOverallOvcServ')
    async getOverallOvcServ(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcOverallOvcServQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOvcServBySex')
    async getOvcServBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcServBySexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOvcCareGiversRelationshipToOvcClient')
    async getOvcCareGiversRelationshipToOvcClient(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcCaregiversRelationshipToOvcClientQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionEnrolledCPIMSOverall')
    async getProportionEnrolledCPIMSOverall(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetProportionOfOvcClientsEnrolledInCpimsOverallQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getProportionEnrolledCPIMSByGender')
    async getProportionEnrolledCPIMSByGender(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetProportionOfOvcClientsEnrolledInCpimsByGenderQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOvcDistributionByCounty')
    async getOvcDistributionByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcDistributionByCountyQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOvcDistributionByPartner')
    async getOvcDistributionByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcDistributionByPartnerQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getOvcClientsExitReasons')
    async getOvcClientsExitReasons(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcClientsExitReasonsQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

    @Get('getOvcViralSuppressionAmongOvcPatientsOverall')
    async getOvcViralSuppressionAmongOvcPatientsOverall(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcViralSuppressionAmongOvcPatientsOverallQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getOvcViralSuppressionAmongOvcPatientsByGender')
    async getOvcViralSuppressionAmongOvcPatientsByGender(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetOvcViralSuppressionAmongOvcPatientsGenderQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('getProportionOfOtzTrainingBySex')
    async getProportionOfOtzTrainingBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup
    ): Promise<any> {
        const query = new GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery();

        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        if(facility) {
            query.facility = facility;
        }

        if(partner) {
            query.partner = partner;
        }

        if(agency) {
            query.agency = agency;
        }

        if(project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }

}
