import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityLevelByOwnershipPartnerQuery } from '../impl/get-facility-level-by-ownership-partner.query';

@QueryHandler(GetFacilityLevelByOwnershipPartnerQuery)
export class GetFacilityLevelByOwnershipPartnerHandler implements IQueryHandler<GetFacilityLevelByOwnershipPartnerQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityLevelByOwnershipPartnerQuery): Promise<any> {
        const facilitiesOwnership = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, PartnerName, Keph_level')
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
            .groupBy('q.PartnerName, Keph_level')
            .orderBy('Keph_level')
            .orderBy('PartnerName')
            .distinct(true)
            .getRawMany();
    }
}
