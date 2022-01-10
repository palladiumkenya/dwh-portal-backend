import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDistributionOfCalhivByAgeSexQuery } from '../impl/get-ovc-distribution-of-calhiv-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcDistributionOfCalhivByAgeSexQuery)
export class GetOvcDistributionOfCalHIVByAgeSexHandler implements IQueryHandler<GetOvcDistributionOfCalhivByAgeSexQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcDistributionOfCalhivByAgeSexQuery): Promise<any> {
        const distributionOfCALHIVAgeAndSex = this.repository.createQueryBuilder('f')
            .select(['Gender,DATIM_AgeGroup, Count (*)OverallCALHIV']);

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
            distributionOfCALHIVAgeAndSex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            distributionOfCALHIVAgeAndSex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            distributionOfCALHIVAgeAndSex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            distributionOfCALHIVAgeAndSex.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await distributionOfCALHIVAgeAndSex.groupBy('Gender, DATIM_AgeGroup').orderBy('DATIM_AgeGroup').getRawMany();
    }
}
