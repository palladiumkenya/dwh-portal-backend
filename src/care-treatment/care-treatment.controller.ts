import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetActiveArtQuery } from './home/queries/impl/get-active-art.query';
import { GetActiveArtAdultsQuery } from './home/queries/impl/get-active-art-adults.query';
import { GetActiveArtChildrenQuery } from './home/queries/impl/get-active-art-children.query';
import { GetActiveArtAdolescentsQuery } from './home/queries/impl/get-active-art-adolescents.query';
import { GetActiveArtByGenderQuery } from './home/queries/impl/get-active-art-by-gender.query';
import { GetCtTxNewQuery } from './home/queries/impl/get-ct-tx-new.query';
import { GetCtStabilityStatusAmongActivePatientsQuery } from './home/queries/impl/get-ct-stability-status-among-active-patients.query';
import { GetCtViralLoadCascadeActiveArtClientsQuery } from './home/queries/impl/get-ct-viral-load-cascade-active-art-clients.query';
import { GetCtViralLoadSuppressionPercentageQuery } from './home/queries/impl/get-ct-viral-load-suppression-percentage.query';

import { GetCtCountyQuery } from './common/queries/impl/get-ct-county.query';
import { GetCtSubCountyQuery } from './common/queries/impl/get-ct-sub-county.query';
import { GetCtFacilitiesQuery } from './common/queries/impl/get-ct-facilities.query';
import { GetCtPartnersQuery } from './common/queries/impl/get-ct-partners.query';

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
import { GetDsdAppointmentDurationBySexQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-sex.query';
import { GetDsdAppointmentDurationByAgeQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-age.query';
import { GetDsdAppointmentDurationByCountyQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-county.query';
import { GetDsdAppointmentDurationByPartnerQuery } from './dsd/queries/impl/get-dsd-appointment-duration-by-partner.query';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusQuery } from './dsd/queries/impl/get-dsd-appointment-duration-categorization-by-stability-status.query';

import { GetTreatmentOutcomesOverallQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-overall.query';
import { GetTreatmentOutcomesBySexQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-sex.query';
import { GetTreatmentOutcomesByAgeQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-age.query';
import { GetTreatmentOutcomesByYearQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-year.query';
import { GetTreatmentOutcomesByCountyQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-county.query';
import { GetTreatmentOutcomesByPartnerQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-by-partner.query';
import { GetTreatmentOutcomesRetention3mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-3m.query';
import { GetTreatmentOutcomesRetention6mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-6m.query';
import { GetTreatmentOutcomesRetention12mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-12m.query';
import { GetTreatmentOutcomesRetention24mQuery } from './treatment-outcomes/queries/impl/get-treatment-outcomes-retention-24m.query';

import { GetVlOverallUptakeAndSuppressionQuery } from './viral-load/queries/impl/get-vl-overall-uptake-and-suppression.query';
import { GetVlUptakeBySexQuery } from './viral-load/queries/impl/get-vl-uptake-by-sex.query';
import { GetVlUptakeByAgeQuery } from './viral-load/queries/impl/get-vl-uptake-by-age.query';
import { GetVlUptakeByCountyQuery } from './viral-load/queries/impl/get-vl-uptake-by-county.query';
import { GetVlUptakeByPartnerQuery } from './viral-load/queries/impl/get-vl-uptake-by-partner.query';
import { GetVlOutcomesOverallQuery } from './viral-load/queries/impl/get-vl-outcomes-overall.query';
import { GetVlOutcomesBySexQuery } from './viral-load/queries/impl/get-vl-outcomes-by-sex.query';
import { GetVlSuppressionByAgeQuery } from './viral-load/queries/impl/get-vl-suppression-by-age.query';
import { GetVlSuppressionByRegimenQuery } from './viral-load/queries/impl/get-vl-suppression-by-regimen.query';
import { GetVlSuppressionByYearQuery } from './viral-load/queries/impl/get-vl-suppression-by-year.query';
import { GetVlSuppressionByCountyQuery } from './viral-load/queries/impl/get-vl-suppression-by-county.query';
import { GetVlSuppressionByPartnerQuery } from './viral-load/queries/impl/get-vl-suppression-by-partner.query';
import { GetVlOverallUptakeAndSuppressionByFacilityQuery } from './viral-load/queries/impl/get-vl-overall-uptake-and-suppression-by-facility.query';
import { GetVlMedianTimeToFirstVlByYearQuery } from './viral-load/queries/impl/get-vl-median-time-to-first-vl-by-year.query';
import { GetVlMedianTimeToFirstVlByCountyQuery } from './viral-load/queries/impl/get-vl-median-time-to-first-vl-by-county.query';
import { GetVlMedianTimeToFirstVlByPartnerQuery } from './viral-load/queries/impl/get-vl-median-time-to-first-vl-by-partner.query';

import { GetChildrenAdverseEventsQuery } from './adverse-events/queries/impl/get-children-adverse-events.query';
import { GetAdultsAdverseEventsQuery } from './adverse-events/queries/impl/get-adults-adverse-events.query';
import { GetAeSeverityGradingQuery } from './adverse-events/queries/impl/get-ae-severity-grading.query';
import { GetAeActionsBySeverityQuery } from './adverse-events/queries/impl/get-ae-actions-by-severity.query';
import { GetReportedCausesOfAeQuery } from './adverse-events/queries/impl/get-reported-causes-of-ae.query';
import { GetReportedAesWithSeverityLevelsQuery } from './adverse-events/queries/impl/get-reported-aes-with-severity-levels.query';
import { GetAeActionsByDrugsQuery } from './adverse-events/queries/impl/get-ae-actions-by-drugs.query';
import { GetNumberOfClientWithAeQuery } from './adverse-events/queries/impl/get-number-of-client-with-ae.query';
import { GetNumberOfClientChildrenWithAeQuery } from './adverse-events/queries/impl/get-number-of-client-children-with-ae.query';
import { GetNumberAeReportedInAdultsOver15Query } from './adverse-events/queries/impl/get-number-ae-reported-in-adults-over-15.query';
import { GetNumberAeReportedInChildrenOver15Query } from './adverse-events/queries/impl/get-number-ae-reported-in-children-over-15.query';
import { GetAeTypeBySeverityQuery } from './adverse-events/queries/impl/get-ae-type-by-severity.query';

@Controller('care-treatment')
export class CareTreatmentController {
    constructor(private readonly queryBus: QueryBus) {
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

    @Get('counties')
    async getCounties(): Promise<any> {
        const query = new GetCtCountyQuery();

        return this.queryBus.execute(query);
    }

    @Get('subCounties')
    async getSubCounties(
        @Query('county') county
    ): Promise<any> {
        const query = new GetCtSubCountyQuery();
        if(county) {
            query.county = county;
        }

        return this.queryBus.execute(query);
    }

    @Get('facilities')
    async getFacilities(
        @Query('county') county,
        @Query('subCounty') subCounty
    ): Promise<any> {
        const query = new GetCtFacilitiesQuery();
        if(county) {
            query.county = county;
        }

        if(subCounty) {
            query.subCounty = subCounty;
        }

        return this.queryBus.execute(query);
    }

    @Get('partners')
    async getPartners(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility
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

        return this.queryBus.execute(query);
    }

    @Get('txCurrBySex')
    async getTxCurrBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
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

        return this.queryBus.execute(query);
    }

    @Get('txCurrDistributionByPartner')
    async getTxCurrDistributionByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
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
        @Query('year') year,
        @Query('month') month,
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

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesBySex')
    async getTreatmentOutcomesBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
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

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByAge')
    async getTreatmentOutcomesByAge(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
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

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByYear')
    async getTreatmentOutcomesByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
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

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByCounty')
    async getTreatmentOutcomesByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
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

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
        }

        return this.queryBus.execute(query);
    }

    @Get('treatmentOutcomesByPartner')
    async getTreatmentOutcomesByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
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

        if(year) {
            query.year = year;
        }

        if(month) {
            query.month = month;
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
}
