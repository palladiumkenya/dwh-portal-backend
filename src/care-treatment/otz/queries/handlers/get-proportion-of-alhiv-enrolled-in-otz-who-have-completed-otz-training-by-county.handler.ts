import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOTZEligibilityAndEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery): Promise<any> {
        const proportionWhoCompletedTrainingByCounty = this.repository
            .createQueryBuilder('f')
            .select([
                '[County] County, Sum([CompletedTraining]) count_training, SUM([CompletedTraining]) * 100.0/ SUM(SUM([CompletedTraining])) over () as proportion_training_percent',
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
            proportionWhoCompletedTrainingByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await proportionWhoCompletedTrainingByCounty
            .groupBy('[County]')
            .getRawMany();
    }
}
