import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsSubCountiesQuery } from '../get-hts-sub-counties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsSubCountiesQuery)
export class GetHtsSubCountiesHandler implements IQueryHandler<GetHtsSubCountiesQuery>{
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {}

    async execute(query: GetHtsSubCountiesQuery): Promise<any> {
        const params = [];
        let subCountiesSql = `SELECT DISTINCT \`SubCounty\` AS subCounty FROM \`fact_htsuptake\` WHERE SubCounty IS NOT NULL  `;

        if (query.county) {
            subCountiesSql = `${subCountiesSql} and County=?`;
            params.push(query.county);
        }

        subCountiesSql = `${subCountiesSql} ORDER BY SubCounty ASC`;

        return  await this.repository.query(subCountiesSql, params);
    }
}
