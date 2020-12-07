import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetCountiesQuery } from '../impl/get-counties.query';
import { DimFacility } from '../../entities/dim-facility.entity';


@QueryHandler(GetCountiesQuery)
export class GetCountiesHandler implements IQueryHandler<GetCountiesQuery> {
    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>,
    ) {

    }

    async execute(query: GetCountiesQuery): Promise<any> {
        const counties = this.repository.createQueryBuilder('q')
            .select('q.county', 'county')
            .where('q.facilityId > 0');

        // if (query.county) {
        //     counties.andWhere('q.county IN (:...county)', { county: [query.county] });
        // }

        // if (query.subCounty) {
        //     counties.andWhere('q.subCounty IN (:...subCounty)', { subCounty: [query.subCounty] });
        // }

        // if (query.facility) {
        //     counties.andWhere('q.name IN (:...facility)', { facility: [query.facility] });
        // }

        // if (query.partner) {
        //     counties.andWhere('q.partner IN (:...partner)', { partner: [query.partner] });
        // }

        // if (query.agency) {
        //     counties.andWhere('q.agency IN (:...agency)', { agency: [query.agency] });
        // }

        // if (query.project) {
        //     counties.andWhere('q.project IN (:...project)', { project: [query.project] });
        // }

        return await counties.orderBy('q.county').distinct(true).getRawMany();
    }

}
