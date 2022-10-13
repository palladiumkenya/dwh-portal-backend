import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzOutcomesAmongAlhivWithReSuppressionQuery } from '../impl/get-otz-outcomes-among-alhiv-with-re-suppression.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';

@QueryHandler(GetOtzOutcomesAmongAlhivWithReSuppressionQuery)
export class GetOtzOutcomesAmongAlhivWithReSuppressionHandler implements IQueryHandler<GetOtzOutcomesAmongAlhivWithReSuppressionQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzOutcomesAmongAlhivWithReSuppressionQuery): Promise<any> {
        const baselineVlReSuppression = this.repository.createQueryBuilder('f')
            .select(['DISTINCT\n' +
            'AlHivWithVlGreaterThan1000 = (SELECT COUNT(*) FROM [dbo].[FACT_Trans_OTZEnrollments] b WHERE (CASE WHEN FirstVL = \'undetectable\' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 1000 AND b.OTZEnrollmentDate is not null),\n' +
            'ALHivWithVLLessThan1000WithRepeatVL = (SELECT COUNT(*) FROM [dbo].[FACT_Trans_OTZEnrollments] b WHERE (CASE WHEN [Last12MonthVLResults] = \'undetectable\' THEN 1 ELSE TRY_CONVERT(decimal, [Last12MonthVLResults]) END) < 1000 AND b.OTZEnrollmentDate is not null AND (CASE WHEN FirstVL = \'undetectable\' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 1000 AND b.OTZEnrollmentDate is not null),\n' +
            'ALHivWithVLGreaterThan1000WithRepeatVL = (SELECT COUNT(*) FROM [dbo].[FACT_Trans_OTZEnrollments] b WHERE (CASE WHEN [Last12MonthVLResults] = \'undetectable\' THEN 1 ELSE TRY_CONVERT(decimal, [Last12MonthVLResults]) END) >= 1000 AND b.OTZEnrollmentDate is not null AND (CASE WHEN FirstVL = \'undetectable\' THEN 1 ELSE TRY_CONVERT(decimal, FirstVL) END) >= 1000 AND b.OTZEnrollmentDate is not null)'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

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
            baselineVlReSuppression.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            baselineVlReSuppression.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            baselineVlReSuppression.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            baselineVlReSuppression.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await baselineVlReSuppression.getRawMany();
    }
}
