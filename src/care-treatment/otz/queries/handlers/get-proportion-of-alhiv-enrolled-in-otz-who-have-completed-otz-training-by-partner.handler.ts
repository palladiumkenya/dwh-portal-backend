import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOtz } from './../../entities/aggregate-otz.model';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByPartnerQuery): Promise<any> {
        const proportionWhoCompletedTrainingByCounty = this.repository
            .createQueryBuilder('f')
            .select([
                'CTPartner partner, SUM([CompletedTraining]) count_training, SUM([CompletedTraining]) * 100.0/ SUM(SUM([CompletedTraining])) over () as proportion_training_percent',
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
            proportionWhoCompletedTrainingByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            proportionWhoCompletedTrainingByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await proportionWhoCompletedTrainingByCounty
            .groupBy('CTPartner')
            .getRawMany();
    }
}
