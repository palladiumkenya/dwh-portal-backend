import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOTZEligibilityAndEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery): Promise<any> {
        const proportionWhoCompletedTraining = this.repository
            .createQueryBuilder('f')
            .select([
                '[CompletedTraining] training, Count([CompletedTraining]) count_training',
            ]);

        if (query.county) {
            proportionWhoCompletedTraining.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            proportionWhoCompletedTraining.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            proportionWhoCompletedTraining.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            proportionWhoCompletedTraining.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            proportionWhoCompletedTraining.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionWhoCompletedTraining.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionWhoCompletedTraining.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await proportionWhoCompletedTraining
            .groupBy('CompletedTraining')
            .getRawMany();
    }
}
