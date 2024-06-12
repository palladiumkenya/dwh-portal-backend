import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithReSuppressionQuery } from '../impl/get-otz-outcomes-among-alhiv-with-re-suppression.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetOtzOutcomesAmongAlhivWithReSuppressionQuery)
export class GetOtzOutcomesAmongAlhivWithReSuppressionHandler implements IQueryHandler<GetOtzOutcomesAmongAlhivWithReSuppressionQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }

    async execute(query: GetOtzOutcomesAmongAlhivWithReSuppressionQuery): Promise<any> {
        const baselineVlReSuppression = this.repository
            .createQueryBuilder('f')
            .select([
                'DISTINCT ' +
                    "AlHivWithVlGreaterThan1000 = (SELECT COUNT(*) FROM [dbo].[LineListOTZ] b WHERE (CASE WHEN FirstVL = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 1000),\n" +
                    "ALHivWithVLLessThan1000WithRepeatVL = (SELECT COUNT(*) FROM [dbo].[LineListOTZ] b WHERE (CASE WHEN [ValidVLResult] = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, [ValidVLResult]) END) < 1000 AND (CASE WHEN FirstVL = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 1000)," +
                    "ALHivWithVLGreaterThan1000WithRepeatVL = (SELECT COUNT(*) FROM [dbo].[LineListOTZ] b WHERE (CASE WHEN [ValidVLResult] = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, [ValidVLResult]) END) >= 1000 AND (CASE WHEN FirstVL = 'Undetectable' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 1000)",
            ]);

        if (query.county) {
            baselineVlReSuppression.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            baselineVlReSuppression.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            baselineVlReSuppression.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            baselineVlReSuppression.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            baselineVlReSuppression.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            baselineVlReSuppression.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            baselineVlReSuppression.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await baselineVlReSuppression.getRawMany();
    }
}
