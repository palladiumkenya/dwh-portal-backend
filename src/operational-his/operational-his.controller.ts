import { Controller, Get, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

import {GetNewlyStartedArtQuery} from "./khis/queries/impl/get-newly-started-art.query";
import {GetNewlyStartedArtTrendsQuery} from "./khis/queries/impl/get-newly-started-art-trends.query";
import {GetCurrentOnArtQuery} from "./khis/queries/impl/get-current-on-art.query";
import {GetHtsPositivesTrendsQuery} from "./khis/queries/impl/get-hts-positives-trends.query";
import {GetCurrentOnArtByCountyQuery} from "./khis/queries/impl/get-current-on-art-by-county.query";
import {GetCurrentOnArtByPartnerQuery} from "./khis/queries/impl/get-current-on-art-by-partner.query";
import {GetTxCurrBySexQuery} from "./khis/queries/impl/get-tx-curr-by-sex.query";
import { GetTxNewBySexQuery } from './khis/queries/impl/get-tx-new-by-sex.query';
import {GetTxNewBySexDwhQuery} from "./khis/queries/impl/get-tx-new-by-sex-dwh.query";
import {GetTxCurrBySexDwhQuery} from "./khis/queries/impl/get-tx-curr-by-sex-dwh.query";
import { GetCtTxCurrAgeGroupDistributionByCountyQuery } from './khis/queries/impl/get-ct-tx-curr-age-group-distribution-by-county.query';

@Controller('operational-his')
export class OperationalHisController {
    constructor(private readonly queryBus: QueryBus) {}

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

    @Get('txCurrKHIS')
    async getTxCurrKHIS(
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
        const query = new GetCurrentOnArtQuery();
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

    @Get('htsPositivesTrends')
    async getHtsPositivesTrends(
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
        const query = new GetHtsPositivesTrendsQuery();
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

    @Get('getTxCurrKHISCounty')
    async getTxCurrKHISByCounty(
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
        const query = new GetCurrentOnArtByCountyQuery();
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

    @Get('getTxCurrDWHCounty')
    async getTxCurrDWHByCounty(
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
        const query = new GetCtTxCurrAgeGroupDistributionByCountyQuery();
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
            query.datimAgeGroup = datimAgeGroup.map(ageGrp =>
                ageGrp.replace(' to ', '-'),
            );
        }

        return this.queryBus.execute(query);
    }

    @Get('getTxCurrKHISPartner')
    async getTxCurrKHISByPartner(
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
        const query = new GetCurrentOnArtByPartnerQuery();
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

    @Get('getTxCurrBySexDWH')
    async getTxCurrBySexDWH(
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
        const query = new GetTxCurrBySexDwhQuery();
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

    @Get('getTxCurrBySex')
    async getTxCurrBySexKHIS(
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
        const query = new GetTxCurrBySexQuery();
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

    @Get('getTxNewBySex')
    async getTxNewlyBySexDWHKHIS(
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

    @Get('getTxNewBySexDWH')
    async getTxNewlyBySexKHIS(
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
        const query = new GetTxNewBySexDwhQuery();
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
