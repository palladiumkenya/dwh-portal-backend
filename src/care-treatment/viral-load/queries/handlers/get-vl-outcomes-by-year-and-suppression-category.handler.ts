import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlOutcomesByYearAndSuppressionCategoryQuery } from '../impl/get-vl-outcomes-by-year-and-suppression-category.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransVLOutcome } from '../../entities/fact-trans-vl-outcome.model';
import { Repository } from 'typeorm';


@QueryHandler(GetVlOutcomesByYearAndSuppressionCategoryQuery)
export class GetVlOutcomesByYearAndSuppressionCategoryHandler implements IQueryHandler<GetVlOutcomesByYearAndSuppressionCategoryQuery> {
    constructor(
        @InjectRepository(FactTransVLOutcome, 'mssql')
        private readonly repository: Repository<FactTransVLOutcome>
    ) {
    }

    async execute(query: GetVlOutcomesByYearAndSuppressionCategoryQuery): Promise<any> {
        const vlSuppressionByYear = this.repository.createQueryBuilder('f')
            .select(['StartART_Year year, Last12MVLResult last12MVLResult, SUM(Total_Last12MVL) totalSuppressed'])
            .andWhere('f.StartART_Year IS NOT NULL');

        if (query.county) {
            vlSuppressionByYear.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByYear.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByYear.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByYear.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByYear.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByYear.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionByYear.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByYear
            .groupBy('f.StartART_Year, f.Last12MVLResult')
            .orderBy('f.StartART_Year')
            .getRawMany();
    }
}
