import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetSubCountiesQuery } from '../get-sub-counties.query';
import { InjectRepository } from '@nestjs/typeorm';
import { DimFacility } from '../../../../entities/common/dim-facility.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetSubCountiesQuery)
export class GetSubCountiesHandler implements IQueryHandler<GetSubCountiesQuery> {
    constructor(
        @InjectRepository(DimFacility)
        private readonly repository: Repository<DimFacility>
    ) {
    }

    async execute(query: GetSubCountiesQuery): Promise<any> {
        const params = [];
        let subCountiesSql = `SELECT DISTINCT subCounty FROM dim_facility `;

        if (query.county) {
            subCountiesSql = `${subCountiesSql} WHERE county=?`;
            params.push(query.county);
        }

        const overallResult = await this.repository.query(subCountiesSql, params);
        return overallResult;
    }
}
