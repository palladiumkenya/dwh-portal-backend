import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery } from '../impl/get-proportion-of-alhiv-enrolled-in-otz-who-have-completed-otz-training-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery)
export class GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyHandler implements IQueryHandler<GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetProportionOfAlhivEnrolledInOtzWhoHaveCompletedOtzTrainingByCountyQuery): Promise<any> {
        const proportionWhoCompletedTrainingByCounty = this.repository.createQueryBuilder('f')
            .select(['[County] County, COUNT([OTZ_Traning]) count_training'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

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

        return await proportionWhoCompletedTrainingByCounty
            .groupBy('[County]')
            .getRawMany();
    }
}