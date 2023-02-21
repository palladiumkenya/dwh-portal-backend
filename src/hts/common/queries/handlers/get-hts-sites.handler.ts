import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetHtsSitesQuery } from '../impl/get-hts-sites.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';
import { AllEmrSites } from './../../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetHtsSitesQuery)
export class GetHtsSitesHandler implements IQueryHandler<GetHtsSitesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetHtsSitesQuery): Promise<any> {
        let facilitiesSql = `SELECT
                max(Mflcode) AS mfl,
                FacilityName AS facility,
                max(County) AS county,
                max(subcounty) AS subCounty,
                max(PartnerName) AS partner
            FROM all_EMRSites WHERE FacilityName IS NOT NULL and isHTS = 1`;

        facilitiesSql = `${facilitiesSql} GROUP BY FacilityName`;
        facilitiesSql = `${facilitiesSql} ORDER BY FacilityName ASC`;

        return await this.repository.query(facilitiesSql);
    }
}
