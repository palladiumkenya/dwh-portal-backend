import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsSitesQuery } from '../impl/get-hts-sites.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetHtsSitesQuery)
export class GetHtsSitesHandler implements IQueryHandler<GetHtsSitesQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ) {

    }

    async execute(query: GetHtsSitesQuery): Promise<any> {
        let facilitiesSql = `SELECT
                max(Mflcode) AS mfl,
                FacilityName AS facility,
                max(County) AS county,
                max(subcounty) AS subCounty,
                max(CTPartner) AS partner,
                max(project) AS project
            FROM fact_htsuptake WHERE FacilityName IS NOT NULL `;

        facilitiesSql = `${facilitiesSql} GROUP BY FacilityName`;
        facilitiesSql = `${facilitiesSql} ORDER BY FacilityName ASC`;

        return  await this.repository.query(facilitiesSql);
    }
}
