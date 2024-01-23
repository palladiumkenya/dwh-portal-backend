import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { GetSitesQuery } from '../impl/get-sites.query';
import { AllEmrSites } from './../../../care-treatment/common/entities/all-emr-sites.model';

@QueryHandler(GetSitesQuery)
export class GetSitesHandler implements IQueryHandler<GetSitesQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetSitesQuery): Promise<any> {
        const facilities = this.repository
            .createQueryBuilder('q')
            .select([
                'max(q.MFLCode) mfl, q.Facilityname facility, max(q.county) county, max(q.subCounty) subCounty, max(q.agencyName) agency, max(q.partnerName) partner, max(q.isCt) isCt, max(q.isHts) isHts',
            ])
            .where('q.MFLCode > 0');

        return await facilities
            .groupBy('q.Facilityname')
            .orderBy('q.Facilityname')
            .getRawMany();
    }
}
