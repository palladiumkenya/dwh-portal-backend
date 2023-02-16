import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsAgenciesQuery } from '../impl/get-hts-agencies.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { AllEmrSites } from './../../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetHtsAgenciesQuery)
export class GetHtsAgenciesHandler implements IQueryHandler<GetHtsAgenciesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>
    ) {
        
    }

    async execute(query: GetHtsAgenciesQuery): Promise<any> {
        const params = [];
        let agenciesSql = `SELECT DISTINCT agencyName AS agency FROM all_EMRSites WHERE agencyName IS NOT NULL and isHts = 1`;
  
        if(query.county) {
            agenciesSql = `${agenciesSql} and county IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            agenciesSql = `${agenciesSql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }

        // if(query.facility) {
        //     agenciesSql = `${agenciesSql} and name IN (?)`;
        //     params.push(query.facility);
        // }

        // if(query.partner) {
        //     agenciesSql = `${agenciesSql} and partner IN (?)`;
        //     params.push(query.partner);
        // }

        // if(query.agency) {
        //     agenciesSql = `${agenciesSql} and agency IN (?)`;
        //     params.push(query.agency);
        // }

        // if(query.project) {
        //     agenciesSql = `${agenciesSql} and project IN (?)`;
        //     params.push(query.project);
        // }

        agenciesSql = `${agenciesSql} ORDER BY agencyName ASC`;

        return  await this.repository.query(agenciesSql, params);
    }
}
