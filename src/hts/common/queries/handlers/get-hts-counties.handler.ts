import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsCountiesQuery } from '../impl/get-hts-counties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsCountiesQuery)
export class GetHtsCountiesHandler implements IQueryHandler<GetHtsCountiesQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {
        
    }

    async execute(query: GetHtsCountiesQuery): Promise<any> {
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

        // if(query.agency) {
        //     countiesSql = `${countiesSql} and Agency IN (?)`;
        //     params.push(query.agency);
        // }

        // if(query.project) {
        //     countiesSql = `${countiesSql} and Project IN (?)`;
        //     params.push(query.project);
        // }

        countiesSql = `${countiesSql} ORDER BY County ASC`;

        return  await this.repository.query(countiesSql, params);
    }
}
