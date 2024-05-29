import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityByInfrastructureQuery } from '../impl/get-facility-by-infrastructure.query';

@QueryHandler(GetFacilityByInfrastructureQuery)
export class GetFacilityByInfrastructureHandler implements IQueryHandler<GetFacilityByInfrastructureQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityByInfrastructureQuery): Promise<any> {
        const facilitiesInfrastructure = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, InfrastructureType, PartnerName')
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
            .groupBy('q.InfrastructureType, PartnerName')
            .orderBy('PartnerName')
            .distinct(true)
            .getRawMany();
    }
}
