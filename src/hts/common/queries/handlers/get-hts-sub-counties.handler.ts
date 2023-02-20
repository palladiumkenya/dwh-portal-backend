import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsSubCountiesQuery } from '../impl/get-hts-sub-counties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { AllEmrSites } from './../../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetHtsSubCountiesQuery)
export class GetHtsSubCountiesHandler
    implements IQueryHandler<GetHtsSubCountiesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetHtsSubCountiesQuery): Promise<any> {
        const params = [];
        let subCountiesSql = `SELECT DISTINCT SubCounty AS subCounty FROM all_EMRSites WHERE SubCounty IS NOT NULL and  isHTS = 1`;

        if (query.county) {
            subCountiesSql = `${subCountiesSql} and County IN (?)`;
            params.push(query.county);
        }

        // if(query.subCounty) {
        //     subCountiesSql = `${subCountiesSql} and SubCounty IN (?)`;
        //     params.push(query.subCounty);
        // }

        // if(query.facility) {
        //     subCountiesSql = `${subCountiesSql} and FacilityName IN (?)`;
        //     params.push(query.facility);
        // }

        // if(query.partner) {
        //     subCountiesSql = `${subCountiesSql} and CTPartner IN (?)`;
        //     params.push(query.partner);
        // }

        // if(query.agency) {
        //     subCountiesSql = `${subCountiesSql} and Agency IN (?)`;
        //     params.push(query.agency);
        // }

        // if(query.project) {
        //     subCountiesSql = `${subCountiesSql} and Project IN (?)`;
        //     params.push(query.project);
        // }

        subCountiesSql = `${subCountiesSql} ORDER BY SubCounty ASC`;

        return await this.repository.query(subCountiesSql, params);
    }
}
