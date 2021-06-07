import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcViralSuppressionAmongOvcPatientsGenderQuery } from '../impl/get-ovc-viral-suppression-among-ovc-patients-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcViralSuppressionAmongOvcPatientsGenderQuery)
export class GetOvcViralSuppressionAmongOvcPatientsGenderHandler implements IQueryHandler<GetOvcViralSuppressionAmongOvcPatientsGenderQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcViralSuppressionAmongOvcPatientsGenderQuery): Promise<any> {
        const viralSuppressionAmongOvcByGender = this.repository.createQueryBuilder('f')
            .select(['[Last12MVLResult], Gender, COUNT(*) suppressed'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            viralSuppressionAmongOvcByGender.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            viralSuppressionAmongOvcByGender.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            viralSuppressionAmongOvcByGender.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            viralSuppressionAmongOvcByGender.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await viralSuppressionAmongOvcByGender
            .groupBy('Last12MVLResult, Gender')
            .getRawMany();
    }
}