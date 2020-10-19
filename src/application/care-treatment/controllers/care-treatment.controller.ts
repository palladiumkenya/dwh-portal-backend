import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetActiveArtQuery } from '../queries/get-active-art.query';
import { GetActiveArtAdultsQuery } from '../queries/get-active-art-adults.query';
import { GetActiveArtChildrenQuery } from '../queries/get-active-art-children.query';
import { GetActiveArtAdolescentsQuery } from '../queries/get-active-art-adolescents.query';
import { GetActiveArtByGenderQuery } from '../queries/get-active-art-by-gender.query';
import { GetCtCountyQuery } from '../queries/get-ct-county.query';
import { GetCtSubCountyQuery } from '../queries/get-ct-sub-county.query';
import { GetCtFacilitiesQuery } from '../queries/get-ct-facilities.query';
import { GetCtPartnersQuery } from '../queries/get-ct-partners.query';
import { GetCtTxNewQuery } from '../queries/get-ct-tx-new.query';
import { GetCtStabilityStatusAmongActivePatientsQuery } from '../queries/get-ct-stability-status-among-active-patients.query';
import { GetCtViralLoadCascadeActiveArtClientsQuery } from '../queries/get-ct-viral-load-cascade-active-art-clients.query';
import { GetCtViralLoadSuppressionPercentageQuery } from '../queries/get-ct-viral-load-suppression-percentage.query';
import { GetCtTxCurrByAgeAndSexQuery } from '../queries/get-ct-tx-curr-by-age-and-sex.query';
import { GetCtTxCurrDistributionByCountyQuery } from '../queries/get-ct-tx-curr-distribution-by-county.query';
import { GetCtTxCurrDistributionByPartnerQuery } from '../queries/get-ct-tx-curr-distribution-by-partner.query';
import { GetTxNewTrendsQuery } from '../queries/get-tx-new-trends.query';
import { GetTxNewByAgeSexQuery } from '../queries/get-tx-new-by-age-sex.query';
import { GetMedianTimeToArtByYearQuery } from '../queries/get-median-time-to-art-by-year.query';
import { GetMedianTimeToArtByCountyQuery } from '../queries/get-median-time-to-art-by-county.query';
import { GetMedianTimeToArtByPartnerQuery } from '../queries/get-median-time-to-art-by-partner.query';
import { GetTimeToArtQuery } from '../queries/get-time-to-art.query';
import { GetTimeToArtFacilitiesQuery } from '../queries/get-time-to-art-facilities.query';
import { GetDsdCascadeQuery } from '../queries/get-dsd-cascade.query';
import { GetDsdUnstableQuery } from '../queries/get-dsd-unstable.query';
import { GetDsdMmdStableQuery } from '../queries/get-dsd-mmd-stable.query';
import { GetDsdStabilityStatusQuery } from '../queries/get-dsd-stability-status.query';
import { GetDsdStabilityStatusByAgeSexQuery } from '../queries/get-dsd-stability-status-by-age-sex.query';
import { GetDsdStabilityStatusByCountyQuery } from '../queries/get-dsd-stability-status-by-county.query';
import { GetDsdStabilityStatusByPartnerQuery } from '../queries/get-dsd-stability-status-by-partner.query';
import { GetDsdAppointmentDurationBySexQuery } from '../queries/get-dsd-appointment-duration-by-sex.query';
import { GetDsdAppointmentDurationByAgeQuery } from '../queries/get-dsd-appointment-duration-by-age.query';
import { GetDsdAppointmentDurationByCountyQuery } from '../queries/get-dsd-appointment-duration-by-county.query';
import { GetDsdAppointmentDurationByPartnerQuery } from '../queries/get-dsd-appointment-duration-by-partner.query';
import { GetDsdAppointmentDurationCategorizationByStabilityStatusQuery } from '../queries/get-dsd-appointment-duration-categorization-by-stability-status.query';
import { GetCtTxCurrAgeGroupDistributionByCountyQuery } from '../queries/get-ct-tx-curr-age-group-distribution-by-county.query';
import { GetTreatmentOutcomesOverallQuery } from '../queries/get-treatment-outcomes-overall.query';
import { GetTreatmentOutcomesBySexQuery } from '../queries/get-treatment-outcomes-by-sex.query';
import { GetTreatmentOutcomesByAgeQuery } from '../queries/get-treatment-outcomes-by-age.query';
import { GetTreatmentOutcomesByYearQuery } from '../queries/get-treatment-outcomes-by-year.query';
import { GetTreatmentOutcomesByCountyQuery } from '../queries/get-treatment-outcomes-by-county.query';
import { GetTreatmentOutcomesByPartnerQuery } from '../queries/get-treatment-outcomes-by-partner.query';
import { GetTreatmentOutcomesRetention3mQuery } from '../queries/get-treatment-outcomes-retention-3m.query';
import { GetTreatmentOutcomesRetention6mQuery } from '../queries/get-treatment-outcomes-retention-6m.query';
import { GetTreatmentOutcomesRetention12mQuery } from '../queries/get-treatment-outcomes-retention-12m.query';
import { GetTreatmentOutcomesRetention24mQuery } from '../queries/get-treatment-outcomes-retention-24m.query';
import { GetCtTxCurrAgeGroupDistributionByPartnerQuery } from '../queries/get-ct-tx-curr-age-group-distribution-by-partner.query';
import { GetVlOverallUptakeAndSuppressionQuery } from '../queries/get-vl-overall-uptake-and-suppression.query';
import { GetVlUptakeBySexQuery } from '../queries/get-vl-uptake-by-sex.query';
import { GetVlUptakeByAgeQuery } from '../queries/get-vl-uptake-by-age.query';
import { GetVlUptakeByCountyQuery } from '../queries/get-vl-uptake-by-county.query';
import { GetVlUptakeByPartnerQuery } from '../queries/get-vl-uptake-by-partner.query';

@Controller('care-treatment')
export class CareTreatmentController {
    constructor(private readonly queryBus: QueryBus) {
    }

    @Get('activeArt')
    async getActiveClientsOnArt(): Promise<any> {
        const query = new GetActiveArtQuery();

        return this.queryBus.execute(query);
    }

    @Get('activeArtChildren')
    async getActiveClientsOnArtChildren(): Promise<any> {
        const query = new GetActiveArtChildrenQuery();

        return this.queryBus.execute(query);
    }

    @Get('activeArtAdults')
    async getActiveClientsOnArtAdults(): Promise<any> {
        const query = new GetActiveArtAdultsQuery();

        return this.queryBus.execute(query);
    }

    @Get('activeArtAdolescents')
    async getActiveClientsOnArtAdolescents(): Promise<any> {
        const query = new GetActiveArtAdolescentsQuery();

        return this.queryBus.execute(query);
    }

    @Get('activeArtByGender')
    async getActiveClientsByGender(): Promise<any> {
        const query = new GetActiveArtByGenderQuery();

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
}
