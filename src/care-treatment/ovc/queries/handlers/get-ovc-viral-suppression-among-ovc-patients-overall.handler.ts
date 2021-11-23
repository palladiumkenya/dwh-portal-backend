import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcViralSuppressionAmongOvcPatientsOverallQuery } from '../impl/get-ovc-viral-suppression-among-ovc-patients-overall.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcViralSuppressionAmongOvcPatientsOverallQuery)
export class GetOvcViralSuppressionAmongOvcPatientsOverallHandler implements IQueryHandler<GetOvcViralSuppressionAmongOvcPatientsOverallQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcViralSuppressionAmongOvcPatientsOverallQuery): Promise<any> {
        const viralSuppressionAmongOvcPatients = this.repository.createQueryBuilder('f')
            .select(['[Last12MVLResult], COUNT(*) suppressed'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            viralSuppressionAmongOvcPatients.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            viralSuppressionAmongOvcPatients.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            viralSuppressionAmongOvcPatients.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            viralSuppressionAmongOvcPatients.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            viralSuppressionAmongOvcPatients.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        return await viralSuppressionAmongOvcPatients
            .groupBy('Last12MVLResult')
            .getRawMany();
    }
}
