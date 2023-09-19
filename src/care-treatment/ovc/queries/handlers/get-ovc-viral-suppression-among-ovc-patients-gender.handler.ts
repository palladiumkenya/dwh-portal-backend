import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcViralSuppressionAmongOvcPatientsGenderQuery } from '../impl/get-ovc-viral-suppression-among-ovc-patients-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcViralSuppressionAmongOvcPatientsGenderQuery)
export class GetOvcViralSuppressionAmongOvcPatientsGenderHandler implements IQueryHandler<GetOvcViralSuppressionAmongOvcPatientsGenderQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcViralSuppressionAmongOvcPatientsGenderQuery): Promise<any> {
        const viralSuppressionAmongOvcByGender = this.repository
            .createQueryBuilder('f')
            .select([
                '[ValidVLResultCategory] Last12MVLResult, Gender, COUNT(*) suppressed',
            ])
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
            viralSuppressionAmongOvcByGender.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            viralSuppressionAmongOvcByGender.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }
        
        if (query.datimAgeGroup) {
            viralSuppressionAmongOvcByGender.andWhere(
                'f.DATIMAgeGroup IN (:...ageGroups)',
                {
                    ageGroups: query.datimAgeGroup,
                },
            );
        }

        return await viralSuppressionAmongOvcByGender
            .groupBy('ValidVLResultCategory, Gender')
            .getRawMany();
    }
}
