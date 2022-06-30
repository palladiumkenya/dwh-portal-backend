import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import { GetTxNewTrendsQuery } from './new-on-art/queries/impl/get-tx-new-trends.query';
import { GetTxNewByAgeSexQuery } from './new-on-art/queries/impl/get-tx-new-by-age-sex.query';
import { GetTxNewBySexQuery } from './new-on-art/queries/impl/get-tx-new-by-sex.query';



import {GetNewlyStartedArtQuery} from "./khis/queries/impl/get-newly-started-art.query";
import {GetNewlyStartedArtTrendsQuery} from "./khis/queries/impl/get-newly-started-art-trends.query";

@Controller('operational-his')
export class OperationalHisController {
    constructor(private readonly queryBus: QueryBus) {}

    @Get('txNewTrends')
    async getTxNewTrends(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
    ): Promise<any> {
        const query = new GetTxNewTrendsQuery();
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

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
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
        @Query('agency') agency,
        @Query('project') project,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
    ): Promise<any> {
        const query = new GetTxNewByAgeSexQuery();
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

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
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
        @Query('agency') agency,
        @Query('project') project,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
    ): Promise<any> {
        const query = new GetTxNewBySexQuery();
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

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }



    @Get('txNewKHIS')
    async getTxNewKHIS(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
    ): Promise<any> {
        const query = new GetNewlyStartedArtQuery();
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

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }


    @Get('txNewTrendsKHIS')
    async getTxNewTrendsKHIS(
        @Query('county') county,
        @Query('subCounty') subCounty,
        @Query('facility') facility,
        @Query('partner') partner,
        @Query('year') year,
        @Query('month') month,
        @Query('agency') agency,
        @Query('project') project,
        @Query('gender') gender,
        @Query('datimAgeGroup') datimAgeGroup,
    ): Promise<any> {
        const query = new GetNewlyStartedArtTrendsQuery();
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

        if (gender) {
            query.gender = gender;
        }

        if (datimAgeGroup) {
            query.datimAgeGroup = datimAgeGroup;
        }

        return this.queryBus.execute(query);
    }



}
