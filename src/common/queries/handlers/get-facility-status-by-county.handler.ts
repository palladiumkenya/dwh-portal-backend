import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityStatusByCountyQuery } from '../impl/get-facility-status-by-county.query';

@QueryHandler(GetFacilityStatusByCountyQuery)
export class GetFacilityStatusByCountyHandler implements IQueryHandler<GetFacilityStatusByCountyQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityStatusByCountyQuery): Promise<any> {
        const facilitiesStatus = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, EMR_Status, County')
            .where('EMR_Status is not null');

        if (query.county) {
            facilitiesStatus.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            facilitiesStatus.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }

        return await facilitiesStatus
            .groupBy('q.EMR_Status, County')
            .orderBy('County')
            .distinct(true)
            .getRawMany();
    }
}
