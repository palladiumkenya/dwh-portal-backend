import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithBaselineVlQuery } from '../impl/get-otz-outcomes-among-alhiv-with-baseline-vl.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';

@QueryHandler(GetOtzOutcomesAmongAlhivWithBaselineVlQuery)
export class GetOtzOutcomesAmongAlhivWithBaselineVlHandler implements IQueryHandler<GetOtzOutcomesAmongAlhivWithBaselineVlQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzOutcomesAmongAlhivWithBaselineVlQuery): Promise<any> {
        const baselineVl = this.repository.createQueryBuilder('f')
            .select(['AlHivEnrolledInOTZ = COUNT(*),\n' +
            'AlHivWithBaselineVl = (SELECT COUNT(*) FROM [dbo].[FACT_Trans_OTZEnrollments] WHERE FirstVL IS NOT NULL AND OTZEnrollmentDate is not null),\n' +
            'AlHivWithVlLessThan1000 = (SELECT COUNT(*) FROM [dbo].[FACT_Trans_OTZEnrollments] WHERE (CASE WHEN FirstVL = \'undetectable\' THEN 1 ELSE FirstVL END) < 1000  AND OTZEnrollmentDate is not null),\n' +
            'AlHivWithVlGreaterThan1000 = (SELECT COUNT(*) FROM [dbo].[FACT_Trans_OTZEnrollments] WHERE (CASE WHEN FirstVL = \'undetectable\' THEN 1 ELSE FirstVL END) >= 1000 AND OTZEnrollmentDate is not null)\n'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            baselineVl.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            baselineVl.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            baselineVl.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            baselineVl.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            baselineVl.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            baselineVl.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            baselineVl.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await baselineVl.getRawMany();
    }
}
