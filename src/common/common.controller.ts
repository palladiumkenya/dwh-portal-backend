import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountiesQuery } from './queries/impl/get-counties.query';
import { GetSubCountiesQuery } from './queries/impl/get-sub-counties.query';
import { GetFacilitiesQuery } from './queries/impl/get-facilities.query';
import { GetPartnersQuery } from './queries/impl/get-partners.query';
import { GetAgenciesQuery } from './queries/impl/get-agencies.query';
import { GetProjectsQuery } from './queries/impl/get-projects.query';
import { GetSitesQuery } from './queries/impl/get-sites.query';

@Controller('common')
export class CommonController {
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
        const query = new GetCountiesQuery();
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
        const query = new GetSubCountiesQuery();
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
        const query = new GetFacilitiesQuery();
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
        const query = new GetPartnersQuery();
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
        const query = new GetAgenciesQuery();
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
        const query = new GetProjectsQuery();
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
        return this.queryBus.execute(new GetSitesQuery());
    }
}
