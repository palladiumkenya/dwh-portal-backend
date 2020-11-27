import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtFacilitiesQuery } from '../impl/get-ct-facilities.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtFacilitiesQuery)
export class GetCtFacilitiesHandler implements IQueryHandler<GetCtFacilitiesQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtFacilitiesQuery): Promise<any> {
        const facilities = this.repository.createQueryBuilder('f')
            .select(['distinct [FacilityName] facility'])
            .where('f.[FacilityName] IS NOT NULL');

        if (query.county) {
            facilities
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            facilities
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        return await facilities
            .orderBy('f.FacilityName')
            .getRawMany();
    }
}
