import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityLevelByOwnershipCountyQuery } from '../impl/get-facility-level-by-ownership-county.query';

@QueryHandler(GetFacilityLevelByOwnershipCountyQuery)
export class GetFacilityLevelByOwnershipCountyHandler implements IQueryHandler<GetFacilityLevelByOwnershipCountyQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityLevelByOwnershipCountyQuery): Promise<any> {
        const facilitiesOwnership = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, County, Keph_level')
            .where(`Keph_level is not null AND EMR_Status = 'Active'`);

        if (query.county) {
            facilitiesOwnership.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            facilitiesOwnership.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }


        return await facilitiesOwnership
            .groupBy('q.County, Keph_level')
            .orderBy('Keph_level')
            .orderBy('County')
            .distinct(true)
            .getRawMany();
    }
}
