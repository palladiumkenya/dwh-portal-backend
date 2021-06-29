import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { GetSitesQuery } from '../impl/get-sites.query';

@QueryHandler(GetSitesQuery)
export class GetSitesHandler implements IQueryHandler<GetSitesQuery> {
    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>,
    ) {

    }

    async execute(query: GetSitesQuery): Promise<any> {
        const facilities = this.repository.createQueryBuilder('q')
            .select(['max(q.facilityId) mfl, q.name facility, max(q.county) county, max(q.subCounty) subCounty, max(q.agency) agency, max(q.partner) partner, max(q.isCt) isCt, max(q.isHts) isHts, max(q.isPkv) isPkv'])
            .where('q.facilityId > 0');

        return await facilities.groupBy('q.name').orderBy('q.name').getRawMany();
    }
}
