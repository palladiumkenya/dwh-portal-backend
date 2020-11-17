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
        const counties = await this.repository
            .createQueryBuilder()
            .select('county')
            .orderBy('county')
            .distinct(true)
            .getRawMany();

        return counties;
    }

}
