import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcViralSuppressionAmongOvcPatientsOverallQuery } from '../impl/get-ovc-viral-suppression-among-ovc-patients-overall.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcViralSuppressionAmongOvcPatientsOverallQuery)
export class GetOvcViralSuppressionAmongOvcPatientsOverallHandler implements IQueryHandler<GetOvcViralSuppressionAmongOvcPatientsOverallQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcViralSuppressionAmongOvcPatientsOverallQuery): Promise<any> {
        const viralSuppressionAmongOvcPatients = this.repository
            .createQueryBuilder('f')
            .select([
                '[ValidVLResultCategory] Last12MVLResult, COUNT(*) suppressed',
            ])
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
            viralSuppressionAmongOvcPatients.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            viralSuppressionAmongOvcPatients.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            viralSuppressionAmongOvcPatients.andWhere(
                'f.Sex IN (:...genders)',
                {
                    genders: query.gender,
                },
            );
        }

        if (query.datimAgeGroup) {
            viralSuppressionAmongOvcPatients.andWhere(
                'f.DATIMAgeGroup IN (:...ageGroups)',
                {
                    ageGroups: query.datimAgeGroup,
                },
            );
        }

        return await viralSuppressionAmongOvcPatients
            .groupBy('ValidVLResultCategory')
            .getRawMany();
    }
}
