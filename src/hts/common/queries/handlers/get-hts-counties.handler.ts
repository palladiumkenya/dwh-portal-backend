import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsCountiesQuery } from '../impl/get-hts-counties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { AllEmrSites } from './../../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetHtsCountiesQuery)
export class GetHtsCountiesHandler
    implements IQueryHandler<GetHtsCountiesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetHtsCountiesQuery): Promise<any> {
        const params = [];
        let countiesSql = `SELECT DISTINCT County AS county FROM all_EMRSites WHERE County IS NOT NULL and isHTS = 1`;

        // if(query.county) {
        //     countiesSql = `${countiesSql} and County IN (?)`;
        //     params.push(query.county);
        // }

        // if(query.subCounty) {
        //     countiesSql = `${countiesSql} and SubCounty IN (?)`;
        //     params.push(query.subCounty);
        // }

        // if(query.facility) {
        //     countiesSql = `${countiesSql} and FacilityName IN (?)`;
        //     params.push(query.facility);
        // }

        // if(query.partner) {
        //     countiesSql = `${countiesSql} and CTPartner IN (?)`;
        //     params.push(query.partner);
        // }

        // if(query.agency) {
        //     countiesSql = `${countiesSql} and Agency IN (?)`;
        //     params.push(query.agency);
        // }

        // if(query.project) {
        //     countiesSql = `${countiesSql} and Project IN (?)`;
        //     params.push(query.project);
        // }

        countiesSql = `${countiesSql} ORDER BY County ASC`;

        return await this.repository.query(countiesSql, params);
    }
}
