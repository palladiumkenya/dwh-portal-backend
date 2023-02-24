import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetHtsCountiesQuery } from './common/queries/impl/get-hts-counties.query';
import { GetHtsSubCountiesQuery } from './common/queries/impl/get-hts-sub-counties.query';
import { GetHtsFacilitiesQuery } from './common/queries/impl/get-hts-facilities.query';
import { GetHtsPartnersQuery } from './common/queries/impl/get-hts-partners.query';
import { GetHtsAgenciesQuery } from './common/queries/impl/get-hts-agencies.query';
import { GetHtsProjectsQuery } from './common/queries/impl/get-hts-projects.query';
import { GetHtsSitesQuery } from './common/queries/impl/get-hts-sites.query';

import { GetNumberTestedPositivityQuery } from './uptake/queries/impl/get-number-tested-positivity.query';
import { GetUptakeBySexQuery } from './uptake/queries/impl/get-uptake-by-sex.query';
import { GetUptakeByAgeSexQuery } from './uptake/queries/impl/get-uptake-by-age-sex.query';
import { GetUptakeByPopulationTypeQuery } from './uptake/queries/impl/get-uptake-by-population-type.query';
import { GetUptakeByTestingStrategyQuery } from './uptake/queries/impl/get-uptake-by-testing-strategy.query';
import { GetUptakeByEntryPointQuery } from './uptake/queries/impl/get-uptake-by-entrypoint.query';
import { GetUptakeByCountyQuery } from './uptake/queries/impl/get-uptake-by-county.query';
import { GetUptakeByPartnerQuery } from './uptake/queries/impl/get-uptake-by-partner.query';
import { GetUptakeByTestedasQuery } from './uptake/queries/impl/get-uptake-by-testedas.query';
import { GetUptakeByClientSelfTestedQuery } from './uptake/queries/impl/get-uptake-by-client-self-tested.query';
import { GetUptakeByMonthsSinceLastTestQuery } from './uptake/queries/impl/get-uptake-by-months-since-last-test.query';
import { GetUptakeByTbScreeningQuery } from './uptake/queries/impl/get-uptake-by-tb-screening.query';
import { GetUptakeByTbScreenedQuery } from './uptake/queries/impl/get-uptake-by-tb-screened.query';
import { GetUptakeByAgeSexPositivityQuery } from './uptake/queries/impl/get-uptake-by-age-sex-positivity.query';
import { GetUptakeByPositivityQuery } from './uptake/queries/impl/get-uptake-by-positivity.query';

import { GetLinkageNumberPositiveQuery } from './linkage/queries/impl/get-linkage-number-positive.query';
import { GetLinkageNumberPositiveByTypeQuery } from './linkage/queries/impl/get-linkage-number-positive-by-type.query';
import { GetLinkageByAgeSexQuery } from './linkage/queries/impl/get-linkage-by-age-sex.query';
import { GetLinkageBySexQuery } from './linkage/queries/impl/get-linkage-by-sex.query';
import { GetLinkageByPopulationTypeQuery } from './linkage/queries/impl/get-linkage-by-population-type.query';
import { GetLinkageByEntryPointQuery } from './linkage/queries/impl/get-linkage-by-entry-point.query';
import { GetLinkageByStrategyQuery } from './linkage/queries/impl/get-linkage-by-strategy.query';
import { GetLinkageByCountyQuery } from './linkage/queries/impl/get-linkage-by-county.query';
import { GetLinkageByPartnerQuery } from './linkage/queries/impl/get-linkage-by-partner.query';
import { GetLinkageNumberNotLinkedByFacilityQuery } from './linkage/queries/impl/get-linkage-number-not-linked-by-facility.query';

import { GetPnsSexualContactsCascadeQuery } from './pns/queries/impl/get-pns-sexual-contacts-cascade.query';
import { GetPnsSexualContactsByAgeSexQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-age-sex.query';
import { GetPnsSexualContactsByYearQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-year.query';
import { GetPnsSexualContactsByPartnerQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-partner.query';
import { GetPnsSexualContactsByCountyQuery } from './pns/queries/impl/get-pns-sexual-contacts-by-county.query';
import { GetPnsChildrenCascadeQuery } from './pns/queries/impl/get-pns-children-cascade.query';
import { GetPnsChildrenByYearQuery } from './pns/queries/impl/get-pns-children-by-year.query';
import { GetPnsIndexQuery } from './pns/queries/impl/get-pns-index.query';
import { GetPnsKnowledgeHivStatusCascadeQuery } from './pns/queries/impl/get-pns-knowledge-hiv-status-cascade.query';
import { GetNewOnPrepQuery } from './prep/queries/impl/get-new-on-prep.query';
import { GetPrepDiscontinuationHandler } from './prep/queries/handlers/get-prep-discontinuation';
import { GetPrepDiscontinuationQuery } from './prep/queries/impl/get-prep-discontinuation.query';
import { GetPrepDiscontinuationReasonQuery } from './prep/queries/impl/get-prep-discontinuation-reason.query';
import { from } from 'rxjs';
import { GetNewOnPrepByAgeSexQuery } from './prep/queries/impl/get-new-on-prep-by-age-sex.query';
import { GetNewOnPrepTrendsQuery } from './prep/queries/impl/get-new-on-prep-trends.query';
import { GetPrepEligibleTrendsQuery } from './prep/queries/impl/get-prep-eligible-trends.query';
import { GetCTPrepQuery } from './prep/queries/impl/get-ct-prep.query';
import { GetPrepScreenedTrendsQuery } from './prep/queries/impl/get-prep-screened-trends.query';
import { GetPrepEligibleAgegroupQuery } from './prep/queries/impl/get-prep-eligible-agegroup.query';
import { GetPrepSTIScreeningOutcomeQuery } from './prep/queries/impl/get-prep-sti-screening-outcome.query';
import { GetPrepSTITreatmentOutcomeQuery } from './prep/queries/impl/get-prep-treatment-outcome.query';
import { GetPrepDiscontinuationTrendsQuery } from './prep/queries/impl/get-prep-discontinuation-trends.query';
import { GetCTPrepTrendQuery } from './prep/queries/impl/get-ct-prep-trends.query';
import { GetPrepTotalTestedQuery } from './prep/queries/impl/get-prep-total-tested.query';
import { GetPrepTotalTestedTrendsQuery } from './prep/queries/impl/get-prep-total-tested-trends.query';
import { GetPrepAgeSexTrendsQuery } from './prep/queries/impl/get-prep-age-sex-trends.query';
import { GetPrepTotalTestedAgeSexTrendsMonth1Query } from './prep/queries/impl/get-prep-total-tested-age-sex-trends-month1.query';
import { GetPrepTotalTestedAgeSexTrendsMonth3Query } from './prep/queries/impl/get-prep-total-tested-age-sex-trends-month3.query';
import { GetPrepRefillMonth1Query } from './prep/queries/impl/get-prep-refill-Month1.query';
import { GetPrepRefillMonth3Query } from './prep/queries/impl/get-prep-refill-Month3.query';
import { GetPrepRefillAgeSexMonth1Query } from './prep/queries/impl/get-prep-refill-age-sex-Month1.query';
import { GetPrepRefillAgeSexMonth3Query } from './prep/queries/impl/get-prep-refill-age-sex-Month3.query';
import { GetPrepSTIDiagnosedQuery } from './prep/queries/impl/get-prep-sti-diagnosed.query';

@Controller('hts')
export class HtsController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('sites')
    async getHtsSites(): Promise<any> {
        return this.queryBus.execute(new GetHtsSitesQuery());
    }

    @Get('counties')
    async getCounties(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
    ): Promise<any> {
        const query = new GetHtsCountiesQuery();
        if (county) {
            query.county = county;
        }
        if (subCounty) {
            query.subCounty = subCounty;
        }
        if (facility) {
            query.facility = facility;
        }
        if (partner) {
            query.partner = partner;
        }
        if (agency) {
            query.agency = agency;
        }
        if (project) {
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
        @Query('project') project,
    ): Promise<any> {
        const query = new GetHtsSubCountiesQuery();
        if (county) {
            query.county = county;
        }
        if (subCounty) {
            query.subCounty = subCounty;
        }
        if (facility) {
            query.facility = facility;
        }
        if (partner) {
            query.partner = partner;
        }
        if (agency) {
            query.agency = agency;
        }
        if (project) {
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
        @Query('project') project,
    ): Promise<any> {
        const query = new GetHtsFacilitiesQuery();
        if (county) {
            query.county = county;
        }
        if (subCounty) {
            query.subCounty = subCounty;
        }
        if (facility) {
            query.facility = facility;
        }
        if (partner) {
            query.partner = partner;
        }
        if (agency) {
            query.agency = agency;
        }
        if (project) {
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
        @Query('project') project,
    ): Promise<any> {
        const query = new GetHtsPartnersQuery();
        if (county) {
            query.county = county;
        }
        if (subCounty) {
            query.subCounty = subCounty;
        }
        if (facility) {
            query.facility = facility;
        }
        if (partner) {
            query.partner = partner;
        }
        if (agency) {
            query.agency = agency;
        }
        if (project) {
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
        @Query('project') project,
    ): Promise<any> {
        const query = new GetHtsAgenciesQuery();
        if (county) {
            query.county = county;
        }
        if (subCounty) {
            query.subCounty = subCounty;
        }
        if (facility) {
            query.facility = facility;
        }
        if (partner) {
            query.partner = partner;
        }
        if (agency) {
            query.agency = agency;
        }
        if (project) {
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
        @Query('project') project,
    ): Promise<any> {
        const query = new GetHtsProjectsQuery();
        if (county) {
            query.county = county;
        }
        if (subCounty) {
            query.subCounty = subCounty;
        }
        if (facility) {
            query.facility = facility;
        }
        if (partner) {
            query.partner = partner;
        }
        if (agency) {
            query.agency = agency;
        }
        if (project) {
            query.project = project;
        }
        return this.queryBus.execute(query);
    }

    @Get('numberTestedAndPositivity')
    async getNumberTestedAndPositivity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetNumberTestedPositivityQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByPositivity')
    async getUptakeByPositivity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetUptakeByPositivityQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeBySex')
    async getUptakeBySex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetUptakeBySexQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByAgeSex')
    async getUptakeByAgeSex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetUptakeByAgeSexQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByAgeSexPositivity')
    async getUptakeByAgeSexPositivity(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetUptakeByAgeSexPositivityQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByPopulationType')
    async getUptakeByPopulationType(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
    ): Promise<any> {
        const query = new GetUptakeByPopulationTypeQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByTestStrategy')
    async getUptakeByTestStrategy(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByTestingStrategyQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByEntryPoint')
    async getUptakeByEntryPoint(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByEntryPointQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByCounty')
    async getUptakeByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByCountyQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByPartner')
    async getUptakeByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByPartnerQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByClientTestedAs')
    async getUptakeByClientTestedAs(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByTestedasQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('uptakeByClientSelfTested')
    async getUptakeByClientSelfTested(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByClientSelfTestedQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageNumberPositive')
    async getLinkageNumberPositive(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetLinkageNumberPositiveQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageNumberPositiveByType')
    async getLinkageNumberPositiveByType(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetLinkageNumberPositiveByTypeQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('monthsSinceLastTest')
    async getMonthsSinceLastTest(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByMonthsSinceLastTestQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('tbScreeningOutcomes')
    async getTbScreeningOutcomes(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByTbScreeningQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('tbScreened')
    async gettbScreened(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetUptakeByTbScreenedQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageByAgeSex')
    async getLinkageByAgeSex(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetLinkageByAgeSexQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageBySex')
    async getLinkageBySex(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetLinkageBySexQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageByPopulationType')
    async getLinkageByPopulationType(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetLinkageByPopulationTypeQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (partner) {
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

    @Get('linkageByCounty')
    async getLinkageByCounty(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetLinkageByCountyQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.county = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageByPartner')
    async getLinkageByPartner(
        @Query('facility') facility,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('toDate') toDate,
        @Query('fromDate') fromDate,
    ): Promise<any> {
        const query = new GetLinkageByPartnerQuery();

        if (facility) {
            query.facility = facility;
        }

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.county = subCounty;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageByEntryPoint')
    async getLinkageByEntryPoint(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetLinkageByEntryPointQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageByStrategy')
    async getLinkageByStrategy(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetLinkageByStrategyQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('linkageNumberNotLinkedByFacility')
    async getLinkageNumberNotLinkedByFacility(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('year') year,
        @Query('month') month,
        @Query('partner') partner,
        @Query('facility') facility,
    ): Promise<any> {
        const query = new GetLinkageNumberNotLinkedByFacilityQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (partner) {
            query.partner = partner;
        }

        if (facility) {
            query.facility = facility;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsSexualContactsCascade')
    async GetPnsSexualContactsCascade(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsSexualContactsCascadeQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsChildrenCascade')
    async GetPnsChildrenCascade(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsChildrenCascadeQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsSexualContactsByAgeSex')
    async GetPnsSexualContactsByAgeSex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsSexualContactsByAgeSexQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsSexualContactsByCounty')
    async GetPnsSexualContactsByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsSexualContactsByCountyQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsSexualContactsByPartner')
    async GetPnsSexualContactsByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsSexualContactsByPartnerQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsSexualContactsByYear')
    async GetPnsSexualContactsByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsSexualContactsByYearQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsChildrenByYear')
    async GetPnsChildrenByYear(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsChildrenByYearQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsIndex')
    async GetPnsIndex(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsIndexQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('pnsKnowledgeHivStatusCascade')
    async GetPnsKnowledgeHivStatusCascade(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('project') project,
        @Query('year') year,
        @Query('month') month,
        @Query('fromDate') fromDate,
        @Query('toDate') toDate,
    ): Promise<any> {
        const query = new GetPnsKnowledgeHivStatusCascadeQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (year) {
            query.year = year;
        }

        if (month) {
            query.month = month;
        }

        if (fromDate) {
            query.fromDate = fromDate;
        }

        if (toDate) {
            query.toDate = toDate;
        }

        return this.queryBus.execute(query);
    }

    @Get('getNewOnPrep')
    async GetNewOnPrep(
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
    ): Promise<any> {
        const query = new GetNewOnPrepQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepDiscontinuation')
    async GetPrepDiscontinuation(
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
    ): Promise<any> {
        const query = new GetPrepDiscontinuationQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepDiscontinuationByReason')
    async GetPrepDiscontinuationReason(
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
    ): Promise<any> {
        const query = new GetPrepDiscontinuationReasonQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getNewOnPrepByAgeSex')
    async GetNewOnPrepByAgeSex(
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
    ): Promise<any> {
        const query = new GetNewOnPrepByAgeSexQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getNewOnPrepTrends')
    async GetNewOnPrepTrends(
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
    ): Promise<any> {
        const query = new GetNewOnPrepTrendsQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepEligibleTrends')
    async GetPrepEligibleTrends(
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
    ): Promise<any> {
        const query = new GetPrepEligibleTrendsQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepEligibleAgegroup')
    async GetPrepEligibleAgegroup(
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
    ): Promise<any> {
        const query = new GetPrepEligibleAgegroupQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepScreenedTrends')
    async GetPrepScreenedTrends(
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
    ): Promise<any> {
        const query = new GetPrepScreenedTrendsQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepSTIScreeningOutcome')
    async GetPrepSTIScreeningOutcome(
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
    ): Promise<any> {
        const query = new GetPrepSTIScreeningOutcomeQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepSTITreatmentOutcome')
    async GetPrepSTITreatmentOutcome(
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
    ): Promise<any> {
        const query = new GetPrepSTITreatmentOutcomeQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepDiscontinuationTrends')
    async GetPrepDiscontinuationTrends(
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
    ): Promise<any> {
        const query = new GetPrepDiscontinuationTrendsQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getCTPrepTrend')
    async GetCTPrepTrendQuery(
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
    ): Promise<any> {
        const query = new GetCTPrepTrendQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepSTIDiagnosed')
    async GetPrepSTIDiagnosedQuery(
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
    ): Promise<any> {
        const query = new GetPrepSTIDiagnosedQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepTotalTestedAgeSexTrendsMonth1')
    async GetPrepTotalTestedAgeSexTrendsMonth1Query(
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
    ): Promise<any> {
        const query = new GetPrepTotalTestedAgeSexTrendsMonth1Query();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepTotalTestedAgeSexTrendsMonth3')
    async GetPrepTotalTestedAgeSexTrendsMonth3Query(
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
    ): Promise<any> {
        const query = new GetPrepTotalTestedAgeSexTrendsMonth3Query();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepAgeSexTrends')
    async GetPrepAgeSexTrends(
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
    ): Promise<any> {
        const query = new GetPrepAgeSexTrendsQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepTotalTested')
    async GetPrepTotalTested(
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
    ): Promise<any> {
        const query = new GetPrepTotalTestedQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepRefillMonth1')
    async GetPrepRefillMonth1Query(
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
    ): Promise<any> {
        const query = new GetPrepRefillMonth1Query();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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
    @Get('getPrepRefillMonth3')
    async GetPrepRefillMonth3Query(
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
    ): Promise<any> {
        const query = new GetPrepRefillMonth3Query();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepRefillAgeSexMonth1')
    async GetPrepRefillAgeSexMonth1Query(
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
    ): Promise<any> {
        const query = new GetPrepRefillAgeSexMonth1Query();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepRefillAgeSexMonth3')
    async GetPrepRefillAgeSexMonth3Query(
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
    ): Promise<any> {
        const query = new GetPrepRefillAgeSexMonth3Query();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getPrepTotalTestedTrends')
    async GetPrepTotalTestedTrends(
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
    ): Promise<any> {
        const query = new GetPrepTotalTestedTrendsQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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

    @Get('getCtPrep')
    async GetCTPrep(
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
    ): Promise<any> {
        const query = new GetCTPrepQuery();

        if (county) {
            query.county = county;
        }

        if (subCounty) {
            query.subCounty = subCounty;
        }

        if (facility) {
            query.facility = facility;
        }

        if (partner) {
            query.partner = partner;
        }

        if (agency) {
            query.agency = agency;
        }

        if (project) {
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
