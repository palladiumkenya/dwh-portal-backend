import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetCountiesQuery } from './queries/impl/get-counties.query';
import { GetSubCountiesQuery } from './queries/impl/get-sub-counties.query';
import { GetFacilitiesQuery } from './queries/impl/get-facilities.query';
import { GetPartnersQuery } from './queries/impl/get-partners.query';
import { GetAgenciesQuery } from './queries/impl/get-agencies.query';
import { GetProjectsQuery } from './queries/impl/get-projects.query';
import { GetSitesQuery } from './queries/impl/get-sites.query';
import { GetFacilityStatusQuery } from './queries/impl/get-facility-status.query';
import { GetFacilityStatusByPartnerQuery } from './queries/impl/get-facility-status-by-partner.query';
import { GetFacilityLevelByOwnershipPartnerQuery } from './queries/impl/get-facility-level-by-ownership-partner.query';
import { GetFacilityLevelByOwnershipCountyQuery } from './queries/impl/get-facility-level-by-ownership-county.query';
import { GetFacilityByInfrastructureQuery } from './queries/impl/get-facility-by-infrastructure.query';
import { GetFacilityLinelistQuery } from './queries/impl/get-facility-linelist.query';
import { GetFacilityTxcurrQuery } from './queries/impl/get-facility-txcurr.query';
import { GetFacilityStatusByCountyQuery } from './queries/impl/get-facility-status-by-county.query';
import { GetFacilityByInfrastructureCountyQuery } from './queries/impl/get-facility-by-infrastructure-county.query';
import { GetFacilityArtHtsMnchQuery } from './queries/impl/get-facility-art-hts-mnch.query';
import { GetCountyCoverageHtsQuery } from './queries/impl/get-county-coverage-hts.query';

@Controller('common')
export class CommonController {
    constructor(private readonly queryBus: QueryBus) { }

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

    @Get('facilityStatus')
    async getFacilityStatus(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityStatusQuery();
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
        return this.queryBus.execute(query);
    }

    @Get('facilityStatusByPartner')
    async getFacilityStatusByPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityStatusByPartnerQuery();
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
        return this.queryBus.execute(query);
    }

    @Get('facilityLevelByOwnershipPartner')
    async getFacilityLevelByOwnershipPartner(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityLevelByOwnershipPartnerQuery();
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
        return this.queryBus.execute(query);
    }

    @Get('facilityLevelByOwnershipCounty')
    async getFacilityLevelByOwnershipCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityLevelByOwnershipCountyQuery();
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
        return this.queryBus.execute(query);
    }

    @Get('facilityByInfrastructure')
    async getFacilityByInfrastructure(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityByInfrastructureQuery();
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
        return this.queryBus.execute(query);
    }


    @Get('facilityLinelist')
    async getFacilityLinelist(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityLinelistQuery();
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
        return this.queryBus.execute(query);
    }


    @Get('facilityTxcurr')
    async getFacilityTxCurr(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityTxcurrQuery();
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
        return this.queryBus.execute(query);
    }


    @Get('facilityByInfrastructureCounty')
    async getFacilityByInfrastructureCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityByInfrastructureCountyQuery();
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
        return this.queryBus.execute(query);
    }


    @Get('facilityStatusByCounty')
    async getFacilityStatusByCounty(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityStatusByCountyQuery();
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
        return this.queryBus.execute(query);
    }


    @Get('facilityArtHtsMnch')
    async getFacilityArtHtsMnch(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetFacilityArtHtsMnchQuery();
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
        return this.queryBus.execute(query);
    }


    @Get('getCountyCoverageHts')
    async getCountyCoverageHts(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('agency') agency,
    ): Promise<any> {
        const query = new GetCountyCoverageHtsQuery();
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
        return this.queryBus.execute(query);
    }

    @Get('sites')
    async getSites(): Promise<any> {
        return this.queryBus.execute(new GetSitesQuery());
    }
}
