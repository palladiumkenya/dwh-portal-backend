import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../../../entities/common/dim-facility.entity';
import { GetPartnersQuery } from '../get-partners.query';


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

        if (query.agencies && query.agencies.length>0) {
            partners
                .addSelect('f.agency', 'agency')
                .where("f.agency IN (:...agencies)", { agencies: query.agencies })
        }

        return await partners
            .distinct(true)
            .getRawMany();
    }

}
