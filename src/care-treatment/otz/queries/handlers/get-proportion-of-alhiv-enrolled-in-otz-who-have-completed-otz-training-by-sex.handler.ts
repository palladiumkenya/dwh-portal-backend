import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery): Promise<any> {
        const proportionWhoCompletedTrainingByGender = this.repository.createQueryBuilder('f')
            .select(['[Gender], [OTZ_Traning] training, COUNT([OTZ_Traning]) count_training'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            proportionWhoCompletedTrainingByGender.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionWhoCompletedTrainingByGender.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            proportionWhoCompletedTrainingByGender.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            proportionWhoCompletedTrainingByGender.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            proportionWhoCompletedTrainingByGender.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionWhoCompletedTrainingByGender.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionWhoCompletedTrainingByGender.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await proportionWhoCompletedTrainingByGender
            .groupBy('OTZ_Traning, [Gender]')
            .getRawMany();
    }
}
