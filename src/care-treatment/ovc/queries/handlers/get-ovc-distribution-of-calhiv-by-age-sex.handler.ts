import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDistributionOfCalhivByAgeSexQuery } from '../impl/get-ovc-distribution-of-calhiv-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcDistributionOfCalhivByAgeSexQuery)
export class GetOvcDistributionOfCalHIVByAgeSexHandler implements IQueryHandler<GetOvcDistributionOfCalhivByAgeSexQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcDistributionOfCalhivByAgeSexQuery): Promise<any> {
        const distributionOfCALHIVAgeAndSex = this.repository.createQueryBuilder('f')
            .select(['Gender, DATIMAgeGroup, Count (*) OverallCALHIV']);

        if (query.county) {
            distributionOfCALHIVAgeAndSex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            distributionOfCALHIVAgeAndSex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            distributionOfCALHIVAgeAndSex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            distributionOfCALHIVAgeAndSex.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            distributionOfCALHIVAgeAndSex.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            distributionOfCALHIVAgeAndSex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            distributionOfCALHIVAgeAndSex.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await distributionOfCALHIVAgeAndSex.groupBy('Gender, DATIMAgeGroup').orderBy('DATIMAgeGroup').getRawMany();
    }
}
