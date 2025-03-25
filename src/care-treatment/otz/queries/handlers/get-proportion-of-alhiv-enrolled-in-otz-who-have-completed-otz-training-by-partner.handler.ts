import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOTZEligibilityAndEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery): Promise<any> {
        const proportionWhoCompletedTrainingByCounty = this.repository
            .createQueryBuilder('f')
            .select([
                'PartnerName partner, SUM([CompletedTraining]) count_training, SUM([CompletedTraining]) * 100.0/ SUM(SUM([CompletedTraining])) over () as proportion_training_percent',
            ])
            .andWhere('CompletedTraining > 0');

        if (query.county) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await proportionWhoCompletedTrainingByCounty
            .groupBy('PartnerName')
            .getRawMany();
    }
}
