import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtSitesQuery } from '../impl/get-ct-sites.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistFACTART } from '../../entities/linelist-fact-art.model';

@QueryHandler(GetCtSitesQuery)
export class GetCtSitesHandler implements IQueryHandler<GetCtSitesQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetCtSitesQuery): Promise<any> {
        const facilities = this.repository
            .createQueryBuilder('q')
            .select([
                'max(SiteCode) mfl, FacilityName facility, max(County) county, max(Subcounty) subCounty, max(PartnerName) partner, max(AgencyName) agency',
            ])
            .where('q.FacilityName IS NOT NULL');

        return await facilities
            .groupBy('q.FacilityName')
            .orderBy('q.FacilityName')
            .getRawMany();
    }
}
