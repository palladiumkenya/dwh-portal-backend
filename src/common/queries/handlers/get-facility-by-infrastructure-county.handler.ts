import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityByInfrastructureCountyQuery } from '../impl/get-facility-by-infrastructure-county.query';

@QueryHandler(GetFacilityByInfrastructureCountyQuery)
export class GetFacilityByInfrastructureCountyHandler implements IQueryHandler<GetFacilityByInfrastructureCountyQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityByInfrastructureCountyQuery): Promise<any> {
        const facilitiesInfrastructure = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, InfrastructureType, County')
            .where(`InfrastructureType is not null AND EMR_Status = 'Active'`);

        if (query.county) {
            facilitiesInfrastructure.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            facilitiesInfrastructure.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }


        return await facilitiesInfrastructure
            .groupBy('q.InfrastructureType, County')
            .orderBy('County')
            .distinct(true)
            .getRawMany();
    }
}
