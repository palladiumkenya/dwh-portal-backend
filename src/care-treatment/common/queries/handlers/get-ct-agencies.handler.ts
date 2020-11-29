import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { GetCtAgenciesQuery } from '../impl/get-ct-agencies.query';

@QueryHandler(GetCtAgenciesQuery)
export class GetCtAgenciesHandler implements IQueryHandler<GetCtAgenciesQuery> {
    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>,
    ) {

    }

    async execute(query: GetCtAgenciesQuery): Promise<any> {
        const agencies = this.repository.createQueryBuilder('q')
            .select('q.agency', 'agency')
            .where('q.facilityId > 0');

        if (query.county) {
            agencies.andWhere('q.county IN (:...county)', { county: [query.county] });
        }

        if (query.subCounty) {
            agencies.andWhere('q.subCounty IN (:...subCounty)', { subCounty: [query.subCounty] });
        }

        if (query.facility) {
            agencies.andWhere('q.name IN (:...facility)', { facility: [query.facility] });
        }

        if (query.partner) {
            agencies.andWhere('q.partner IN (:...partner)', { partner: [query.partner] });
        }

        if (query.agency) {
            agencies.andWhere('q.agency IN (:...agency)', { agency: [query.agency] });
        }

        // if (query.project) {
        //     agencies.andWhere('q.project IN (:...project)', { project: [query.project] });
        // }

        return await agencies.orderBy('q.agency').distinct(true).getRawMany();
    }

}
