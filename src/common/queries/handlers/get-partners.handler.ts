import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../entities/dim-facility.entity';
import { GetPartnersQuery } from '../impl/get-partners.query';


@QueryHandler(GetPartnersQuery)
export class GetPartnersHandler implements IQueryHandler<GetPartnersQuery> {

    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>,
    ) {
    }

    async execute(query: GetPartnersQuery): Promise<any> {

        const partners =  this.repository
            .createQueryBuilder('f')
            .select('f.partner','partner')
            .where('f.facilityId > 0');

        if (query.county) {
            partners
                .addSelect('f.county', 'county')
                .andWhere("f.county IN (:...counties)", { counties: [query.county] })
        }
        if (query.agency) {
            partners
                .addSelect('f.agency', 'agency')
                .andWhere("f.agency IN (:...agencies)", { agencies: [query.agency] })
        }
        if (query.agencies && query.agencies.length>0) {
            partners
                .addSelect('f.agency', 'agency')
                .andWhere("f.agency IN (:...agencies)", { agencies: query.agencies })
        }

        return await partners
            .orderBy('f.partner')
            .distinct(true)
            .getRawMany();
    }

}
