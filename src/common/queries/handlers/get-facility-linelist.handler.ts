import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AllEmrSites } from '../../../care-treatment/common/entities/all-emr-sites.model';
import { GetFacilityLinelistQuery } from '../impl/get-facility-linelist.query';

@QueryHandler(GetFacilityLinelistQuery)
export class GetFacilityLinelistHandler implements IQueryHandler<GetFacilityLinelistQuery> {
    constructor(
        @InjectRepository(AllEmrSites, 'mssql')
        private readonly repository: Repository<AllEmrSites>,
    ) {}

    async execute(query: GetFacilityLinelistQuery): Promise<any> {
        const facilitiesLineList = this.repository
            .createQueryBuilder('q')
            .select(
                `MFLCode, FacilityName, SubCounty, County, 
                [PartnerName], [AgencyName],[EMR_Status],[EMR]
                ,[owner],[InfrastructureType], [KEPH_Level]`
            );

        if (query.county) {
            facilitiesLineList.andWhere('q.County IN (:...county)', {
                county: [query.county],
            });
        }

        if (query.subCounty) {
            facilitiesLineList.andWhere('q.SubCounty IN (:...subCounty)', {
                subCounty: [query.subCounty],
            });
        }


        return await facilitiesLineList
            .orderBy('MFLCode')
            .distinct(true)
            .getRawMany();
    }
}
