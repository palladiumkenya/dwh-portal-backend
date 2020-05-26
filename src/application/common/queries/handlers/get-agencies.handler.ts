import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DimFacility } from '../../../../entities/common/dim-facility.entity';
import { GetAgenciesQuery } from '../get-agencies.query';


@QueryHandler(GetAgenciesQuery)
export class GetAgenciesHandler implements IQueryHandler<GetAgenciesQuery> {

    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>,
    ) {
    }

    async execute(query: GetAgenciesQuery): Promise<any> {
        const agencies = await this.repository
            .createQueryBuilder()
            .select('agency')
            .distinct(true)
            .getRawMany()

        return agencies;
    }

}
