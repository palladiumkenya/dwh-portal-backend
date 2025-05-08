import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetAlhivWithReSuppressionQuery } from '../impl/get-alhiv-with-re-suppression.query';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetAlhivWithReSuppressionQuery)
export class GetAlhivWithReSuppressionHandler
    implements IQueryHandler<GetAlhivWithReSuppressionQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<
            LineListOTZEligibilityAndEnrollments
        >,
    ) {}
    async execute(query: GetAlhivWithReSuppressionQuery): Promise<any> {
        const baselineVlReSuppression = this.repository
            .createQueryBuilder('f')
            .select([
                'DISTINCT ' +
                    "AlHivWithVlGreaterThan1000 = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] b WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 200)," +
                    "ALHivWithVLLessThan1000WithRepeatVL = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] b WHERE (CASE WHEN [ValidVLResult] = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, [ValidVLResult]) END) < 200 AND (CASE WHEN FirstVL = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 200)," +
                    "ALHivWithVLGreaterThan1000WithRepeatVL = (SELECT COUNT(*) FROM [dbo].[LineListOTZEligibilityAndEnrollments] b WHERE (CASE WHEN [ValidVLResult] = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, [ValidVLResult]) END) >= 200 AND (CASE WHEN FirstVL = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 200 )",
            ]);

        if (query.county) {
            baselineVlReSuppression.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            baselineVlReSuppression.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            baselineVlReSuppression.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            baselineVlReSuppression.andWhere(
                'f.PartnerName IN (:...partners)',
                {
                    partners: query.partner,
                },
            );
        }

        if (query.agency) {
            baselineVlReSuppression.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            baselineVlReSuppression.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            baselineVlReSuppression.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await baselineVlReSuppression.getRawOne();
    }
}
