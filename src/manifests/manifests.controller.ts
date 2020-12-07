import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetExpectedUploadsQuery } from './queries/impl/get-expected-uploads.query';
import { GetRecencyUploadsQuery } from './queries/impl/get-recency-uploads.query';
import { GetConsistencyUploadsQuery } from './queries/impl/get-consistency-uploads.query';
import { GetTrendsRecencyQuery } from './queries/impl/get-trends-recency.query';
import { GetTrendsConsistencyQuery } from './queries/impl/get-trends-consistency.query';
import { GetEmrDistributionQuery } from './queries/impl/get-emr-distribution.query';
import { GetOverallReportingQuery } from './queries/impl/get-overall-reporting.query';
import { GetRecencyByPartnerQuery } from './queries/impl/get-recency-by-partner.query';
import { GetRecencyByCountyQuery } from './queries/impl/get-recency-by-county.query';
import { GetConsistencyByCountyPartnerQuery } from './queries/impl/get-consistency-by-county-partner.query';

@Controller('manifests')
export class ManifestsController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('expected/:docket')
    async getUploads(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
    ): Promise<any> {
        const query = new GetExpectedUploadsQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        return this.queryBus.execute(query);
    }

    @Get('recency/:docket')
    async getRecency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetRecencyUploadsQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('consistency/:docket')
    async getConsistency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetConsistencyUploadsQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('recency/trends/:docket')
    async getTrendsRecency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period,
    ): Promise<any> {
        const query = new GetTrendsRecencyQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('consistency/trends/:docket')
    async getTrendsConsistency(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('startDate') startDate,
        @Query('endDate') endDate,
    ): Promise<any> {
        const query = new GetTrendsConsistencyQuery(docket, startDate, endDate);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (startDate) {
            query.startDate = startDate;
        }
        if (endDate) {
            query.endDate = endDate;
        }
        return this.queryBus.execute(query);
    }

    @Get('emrdistribution/:docket')
    async getEmrDistribution(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period,
        @Query('reportingType') reportingType
    ): Promise<any> {
        const query = new GetEmrDistributionQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        if(reportingType) {
            query.reportingType = reportingType;
        }

        return this.queryBus.execute(query);
    }

    @Get('overallreporting/:docket')
    async getOverAllReporting(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period,
        @Query('reportingType') reportingType
    ): Promise<any> {
        const query = new GetOverallReportingQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        if(reportingType) {
            query.reportingType = reportingType;
        }
        return this.queryBus.execute(query);
    }

    @Get('recencyreportingbycounty/:docket')
    async getRecencyOfReportingByCounty(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period
    ): Promise<any> {
        const query = new GetRecencyByCountyQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('recencyreportingbypartner/:docket')
    async getRecencyOfReportingByPartner(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period
    ): Promise<any> {
        const query = new GetRecencyByPartnerQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        return this.queryBus.execute(query);
    }

    @Get('consistencyreportingbycountypartner/:docket')
    async getConsistencyOfReportingByCountyPartner(
        @Param('docket') docket,
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
        @Query('year') year,
        @Query('month') month,
        @Query('period') period,
        @Query('reportingType') reportingType
    ): Promise<any> {
        const query = new GetConsistencyByCountyPartnerQuery(docket);
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
        if (year) {
            query.year = year;
        }
        if (month) {
            query.month = month;
        }
        if (period) {
            query.period = period;
        }
        if(reportingType) {
            query.reportingType = reportingType;
        }
        return this.queryBus.execute(query);
    }
}
