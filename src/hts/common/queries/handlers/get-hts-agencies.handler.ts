import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsAgenciesQuery } from '../impl/get-hts-agencies.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsAgenciesQuery)
export class GetHtsAgenciesHandler implements IQueryHandler<GetHtsAgenciesQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
        
    }

    async execute(query: GetHtsAgenciesQuery): Promise<any> {
        const params = [];
        let countiesSql = `SELECT DISTINCT agency AS agency FROM dim_facility WHERE agency IS NOT NULL `;
  
        if(query.county) {
            countiesSql = `${countiesSql} and county IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            countiesSql = `${countiesSql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            countiesSql = `${countiesSql} and name IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            countiesSql = `${countiesSql} and partner IN (?)`;
            params.push(query.partner);
        }

        countiesSql = `${countiesSql} ORDER BY agency ASC`;

        return  await this.repository.query(countiesSql, params);
    }
}
