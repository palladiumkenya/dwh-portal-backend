import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityStatusByPartnerQuery } from '../impl/get-facility-status-by-partner.query';

@QueryHandler(GetFacilityStatusByPartnerQuery)
export class GetFacilityStatusByPartnerHandler implements IQueryHandler<GetFacilityStatusByPartnerQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityStatusByPartnerQuery): Promise<any> {
        const projects = this.repository
            .createQueryBuilder('q')
            .select('COUNT(1) facilities, EMR_Status, PartnerName')
            .where('EMR_Status is not null');

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
            .groupBy('q.EMR_Status, PartnerName')
            .orderBy('PartnerName')
            .distinct(true)
            .getRawMany();
    }
}
