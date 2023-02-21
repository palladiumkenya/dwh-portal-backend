import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsFacilitiesQuery } from '../impl/get-hts-facilities.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { AllEmrSites } from './../../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetHtsFacilitiesQuery)
export class GetHtsFacilitiesHandler
    implements IQueryHandler<GetHtsFacilitiesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetHtsFacilitiesQuery): Promise<any> {
        const params = [];
        let facilitiesSql = `SELECT DISTINCT FacilityName AS facility FROM all_EMRSites WHERE FacilityName IS NOT NULL and isHts = 1`;

        if (query.county) {
            facilitiesSql = `${facilitiesSql} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            facilitiesSql = `${facilitiesSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        // if(query.facility) {
        //     facilitiesSql = `${facilitiesSql} and FacilityName IN (?)`;
        //     params.push(query.facility);
        // }

        // if(query.partner) {
        //     facilitiesSql = `${facilitiesSql} and CTPartner IN (?)`;
        //     params.push(query.partner);
        // }

        // if(query.agency) {
        //     facilitiesSql = `${facilitiesSql} and Agency IN (?)`;
        //     params.push(query.agency);
        // }

        // if(query.project) {
        //     facilitiesSql = `${facilitiesSql} and Project IN (?)`;
        //     params.push(query.project);
        // }

        facilitiesSql = `${facilitiesSql} ORDER BY FacilityName ASC`;

        return await this.repository.query(facilitiesSql, params);
    }
}
