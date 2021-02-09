import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtSitesQuery } from '../impl/get-ct-sites.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtSitesQuery)
export class GetCtSitesHandler implements IQueryHandler<GetCtSitesQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {

    }

    async execute(query: GetCtSitesQuery): Promise<any> {
        const facilities = this.repository.createQueryBuilder('q')
            .select(['max(MFLCode) mfl, FacilityName facility, max(County) county, max(Subcounty) subCounty, max(CTPartner) partner'])
            .where('q.FacilityName IS NOT NULL');

        return await facilities.groupBy('q.FacilityName').orderBy('q.FacilityName').getRawMany();
    }
}
