import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDistributionOfOvcClientsByAgeSexQuery } from '../impl/get-distribution-of-ovc-clients-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetDistributionOfOvcClientsByAgeSexQuery)
export class GetDistributionOfOvcClientsByAgeSexHandler implements IQueryHandler<GetDistributionOfOvcClientsByAgeSexQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetDistributionOfOvcClientsByAgeSexQuery): Promise<any> {
        const distributionOfOvcClientsByAgeSex = this.repository.createQueryBuilder('f')
            .select(['Gender,DATIM_AgeGroup, Count (*)OverallOVC'])
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
            distributionOfOvcClientsByAgeSex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            distributionOfOvcClientsByAgeSex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            distributionOfOvcClientsByAgeSex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            distributionOfOvcClientsByAgeSex.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await distributionOfOvcClientsByAgeSex.groupBy('Gender, DATIM_AgeGroup').orderBy('DATIM_AgeGroup').getRawMany();
    }
}
