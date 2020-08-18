import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsPartnersQuery } from '../get-hts-partners.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../../../entities/hts/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsPartnersQuery)
export class GetHtsPartnersHandler implements IQueryHandler<GetHtsPartnersQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {}

    async execute(query: GetHtsPartnersQuery): Promise<any> {
        const params = [];
        let partnersSql = `SELECT DISTINCT \`CTPartner\` AS \`partner\` FROM \`fact_htsuptake\` WHERE \`CTPartner\` IS NOT NULL `;

        if (query.county) {
            partnersSql = `${partnersSql} and County=?`;
            params.push(query.county);
        }

        if (query.subCounty) {
            partnersSql = `${partnersSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        return  await this.repository.query(partnersSql, params);
    }
}
