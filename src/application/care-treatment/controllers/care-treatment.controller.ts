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
}
