import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../../../entities/common/dim-facility.entity';
import { GetFacilitiesQuery } from '../get-facilities.query';


@QueryHandler(GetFacilitiesQuery)
export class GetFacilitiesHandler implements IQueryHandler<GetFacilitiesQuery> {

    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>,
    ) {
    }

    async execute(query: GetFacilitiesQuery): Promise<any> {

        const facilities = this.repository
            .createQueryBuilder('f')
            .select('f.name', 'name')
            .where('f.facilityId > 0');

        if (query.agencies && query.agencies.length > 0) {
            facilities
                .addSelect('f.agency', 'agency')
                .andWhere('f.agency IN (:...agencies)', { agencies: query.agencies });
        }

        if (query.counties && query.counties.length > 0) {
            facilities
                .addSelect('f.county', 'county')
                .andWhere('f.county IN (:...counties)', { counties: query.counties });
        }

        if (query.subCounty) {
            facilities
                .addSelect('f.subCounty', 'subCounty')
                .andWhere('f.subCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.partners && query.partners.length > 0) {
            facilities
                .addSelect('f.partner', 'partner')
                .andWhere('f.partner IN (:...partners)', { partners: query.partners });
        }

        return await facilities
            .orderBy('f.name')
            .distinct(true)
            .getRawMany();
    }

}
