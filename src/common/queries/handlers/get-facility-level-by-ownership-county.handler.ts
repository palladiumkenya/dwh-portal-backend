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
        const projects = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, County, Keph_level')
            .where('Keph_level is not null');

        if (query.county) {
            projects.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            projects.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }


        return await projects
            .groupBy('q.County, Keph_level')
            .orderBy('Keph_level')
            .orderBy('County')
            .distinct(true)
            .getRawMany();
    }
}
