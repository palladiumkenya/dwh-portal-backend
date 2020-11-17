import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeCountiesQuery } from '../impl/get-uptake-counties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeCountiesQuery)
export class GetUptakeCountiesHandler implements IQueryHandler<GetUptakeCountiesQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
        
    }

    async execute(query: GetUptakeCountiesQuery): Promise<any> {
        const params = [];
        let countiesSql = `SELECT DISTINCT County AS county FROM \`fact_htsuptake\` WHERE County IS NOT NULL `;

        if(query.county) {
            countiesSql = `${countiesSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            countiesSql = `${countiesSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            countiesSql = `${countiesSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            countiesSql = `${countiesSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            countiesSql = `${countiesSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            countiesSql = `${countiesSql} and year=?`;
            params.push(query.year);
        }

        countiesSql = `${countiesSql} ORDER BY County ASC`;

        return  await this.repository.query(countiesSql, params);
    }
}
