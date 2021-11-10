import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingQuery): Promise<any> {
        const proportionWhoCompletedTraining = this.repository.createQueryBuilder('f')
            .select(['[OTZ_Traning] training, COUNT([OTZ_Traning]) count_training'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

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
            proportionWhoCompletedTraining.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            proportionWhoCompletedTraining.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await proportionWhoCompletedTraining
            .groupBy('OTZ_Traning')
            .getRawMany();
    }
}
