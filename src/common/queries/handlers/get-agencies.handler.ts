import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { GetAgenciesQuery } from '../impl/get-agencies.query';


@QueryHandler(GetAgenciesQuery)
export class GetAgenciesHandler implements IQueryHandler<GetAgenciesQuery> {

    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>,
    ) {
    }

    async execute(query: GetAgenciesQuery): Promise<any> {
        const agencies = this.repository
            .createQueryBuilder('f')
            .select('f.agency', 'agency')
            .where('f.facilityId > 0');

        if (query.county) {
            agencies
                .andWhere('f.county IN (:...counties)', { counties: [query.county] });
        }

        return await agencies
            .orderBy('f.agency')
            .distinct(true)
            .getRawMany();
    }

}
