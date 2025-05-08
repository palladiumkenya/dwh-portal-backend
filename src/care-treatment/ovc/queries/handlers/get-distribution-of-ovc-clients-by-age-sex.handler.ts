import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDistributionOfOvcClientsByAgeSexQuery } from '../impl/get-distribution-of-ovc-clients-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetDistributionOfOvcClientsByAgeSexQuery)
export class GetDistributionOfOvcClientsByAgeSexHandler implements IQueryHandler<GetDistributionOfOvcClientsByAgeSexQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetDistributionOfOvcClientsByAgeSexQuery): Promise<any> {
        const distributionOfOvcClientsByAgeSex = this.repository.createQueryBuilder('f')
            .select(['Sex Gender, DATIMAgeGroup, Count (*) OverallOVC'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and f.TXCurr=1');

        if (query.county) {
            distributionOfOvcClientsByAgeSex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            distributionOfOvcClientsByAgeSex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            distributionOfOvcClientsByAgeSex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            distributionOfOvcClientsByAgeSex.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            distributionOfOvcClientsByAgeSex.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            distributionOfOvcClientsByAgeSex.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            distributionOfOvcClientsByAgeSex.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await distributionOfOvcClientsByAgeSex.groupBy('Sex, DATIMAgeGroup').orderBy('DATIMAgeGroup').getRawMany();
    }
}
