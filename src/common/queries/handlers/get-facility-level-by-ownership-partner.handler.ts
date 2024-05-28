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
        const projects = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, PartnerName, Keph_level')
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
            .groupBy('q.PartnerName, Keph_level')
            .orderBy('Keph_level')
            .orderBy('PartnerName')
            .distinct(true)
            .getRawMany();
    }
}
