import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithBaselineVlQuery } from '../impl/get-otz-outcomes-among-alhiv-with-baseline-vl.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from './../../entities/line-list-otz.model';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOtzOutcomesAmongAlhivWithBaselineVlQuery)
export class GetOtzOutcomesAmongAlhivWithBaselineVlHandler
    implements IQueryHandler<GetOtzOutcomesAmongAlhivWithBaselineVlQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOTZEligibilityAndEnrollments>,
    ) {}

    async execute(
        query: GetOtzOutcomesAmongAlhivWithBaselineVlQuery,
    ): Promise<any> {
        const baselineVl = this.repository
            .createQueryBuilder('f')
            .select([
                `
                    AlHivEnrolledInOTZ = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] WHERE Enrolled = 1 ),
                    AlHiv = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments]),
                    AlHivWithBaselineVl = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] WHERE FirstVL IS NOT NULL ),
                    AlHivWithVlLessThan1000 = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 WHEN FirstVL = 'DETECTED' Then 0 ELSE TRY_CONVERT(decimal, FirstVL) END) < 200 ),
                    AlHivWithVlGreaterThan1000 = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 WHEN FirstVL = 'DETECTED' Then 0 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 200 ),
                    AlHivWithBaselineVlEnrolled = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] WHERE FirstVL IS NOT NULL AND Enrolled = 1),
                    AlHivWithVlLessThan1000Enrolled = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 WHEN FirstVL = 'DETECTED' Then 0 ELSE TRY_CONVERT(decimal, FirstVL) END) < 200 AND Enrolled = 1),
                    AlHivWithVlGreaterThan1000Enrolled = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 WHEN FirstVL = 'DETECTED' Then 0 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 200 AND Enrolled = 1)
                `
            ]);

        if (query.county) {
            baselineVl.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            baselineVl.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            baselineVl.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            baselineVl.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            baselineVl.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            baselineVl.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            baselineVl.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await baselineVl.getRawMany();
    }
}
