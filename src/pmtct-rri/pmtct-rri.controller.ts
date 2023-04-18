import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetMissedANCOverviewQuery } from './missed-anc/queries/impl/get-missed-anc-overview.query';
import { GetMissedANCByCountyQuery } from './missed-anc/queries/impl/get-missed-anc-by-county.query';
import { GetMissedANCBySDPQuery } from './missed-anc/queries/impl/get-missed-anc-by-sdp.query';
import { GetMissedANCGapsQuery } from './missed-anc/queries/impl/get-missed-anc-gaps.query';
import { GetMissedHAARTOverviewQuery } from './missed-haart/queries/impl/get-missed-haart-overview.query';
import { GetMissedHAARTByCountyQuery } from './missed-haart/queries/impl/get-missed-haart-by-county.query';
import { GetMissedHAARTBySDPQuery } from './missed-haart/queries/impl/get-missed-haart-by-sdp.query';
import { GetMissedHAARTByFacilityQuery } from './missed-haart/queries/impl/get-missed-haart-by-facility.query';

@Controller('pmtct-rri')
export class PmtctRRIController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('getMissedANCOverview')
    async getMissedANCOverview(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedANCOverviewQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

    @Get('getMissedANCByCounty')
    async getMissedANCByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedANCByCountyQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

    @Get('getMissedANCBySDP')
    async getMissedANCBySDP(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedANCBySDPQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

    @Get('getMissedANCGaps')
    async getMissedANCGaps(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedANCGapsQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

    @Get('getMissedHAARTOverview')
    async getMissedHAARTOverview(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedHAARTOverviewQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

    @Get('getMissedHAARTByCounty')
    async getMissedHAARTByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedHAARTByCountyQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

    @Get('getMissedHAARTBySDP')
    async getMissedHAARTBySDP(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedHAARTBySDPQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

    @Get('getMissedHAARTByFacility')
    async getMissedHAARTByFacility(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('emr') emr,
    ): Promise<any> {
        const query = new GetMissedHAARTByFacilityQuery();
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

        if (agency) {
            query.agency = agency;
        }

        if (project) {
            query.project = project;
        }

        if (emr) {
            query.emr = emr;
        }

        return this.queryBus.execute(query);
    }

}
