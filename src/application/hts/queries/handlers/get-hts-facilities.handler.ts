import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsFacilitiesQuery } from '../get-hts-facilities.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsFacilitiesQuery)
export class GetHtsFacilitiesHandler implements IQueryHandler<GetHtsFacilitiesQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {}

    async execute(query: GetHtsFacilitiesQuery): Promise<any> {
        const params = [];
        let facilitiesSql = `SELECT DISTINCT \`FacilityName\` AS \`name\` FROM \`fact_htsuptake\` WHERE \`FacilityName\` IS NOT NULL `;

        if (query.county) {
            facilitiesSql = `${facilitiesSql} and County=?`;
            params.push(query.county);
        }

        if(query.partner) {
            facilitiesSql = `${facilitiesSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.subCounty) {
            facilitiesSql = `${facilitiesSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        facilitiesSql = `${facilitiesSql} ORDER BY FacilityName ASC`;

        return  await this.repository.query(facilitiesSql, params);
    }
}
