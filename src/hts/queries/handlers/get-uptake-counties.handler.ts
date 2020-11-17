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

    async execute(): Promise<any> {
        const params = [];
        const countiesSql = `SELECT DISTINCT County AS county FROM \`fact_htsuptake\` WHERE County IS NOT NULL ORDER BY County ASC `;

        return  await this.repository.query(countiesSql, params);
    }
}
