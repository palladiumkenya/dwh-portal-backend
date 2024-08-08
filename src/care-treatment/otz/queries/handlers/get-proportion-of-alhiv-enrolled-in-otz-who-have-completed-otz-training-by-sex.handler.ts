import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOTZEligibilityAndEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingBySexQuery): Promise<any> {
        const proportionWhoCompletedTrainingByGender = this.repository
            .createQueryBuilder('f')
            .select([
                '[Gender], [CompletedTraining] training, COUNT([CompletedTraining]) count_training',
            ]);

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
            proportionWhoCompletedTrainingByGender.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            proportionWhoCompletedTrainingByGender.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionWhoCompletedTrainingByGender.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionWhoCompletedTrainingByGender.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await proportionWhoCompletedTrainingByGender
            .groupBy('CompletedTraining, [Gender]')
            .getRawMany();
    }
}
