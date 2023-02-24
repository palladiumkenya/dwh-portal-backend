import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlOutcomesByYearAndSuppressionCategoryQuery } from '../impl/get-vl-outcomes-by-year-and-suppression-category.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransVLOutcome } from '../../entities/fact-trans-vl-outcome.model';
import { Repository } from 'typeorm';
import { AggregateVLUptakeOutcome } from './../../entities/aggregate-vl-uptake-outcome.model';


@QueryHandler(GetVlOutcomesByYearAndSuppressionCategoryQuery)
export class GetVlOutcomesByYearAndSuppressionCategoryHandler implements IQueryHandler<GetVlOutcomesByYearAndSuppressionCategoryQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlOutcomesByYearAndSuppressionCategoryQuery): Promise<any> {
        const vlSuppressionByYear = this.repository.createQueryBuilder('f')
            .select(['StartARTYear year, Last12MVLResult last12MVLResult, SUM(TotalLast12MVL) totalSuppressed'])
            .andWhere('f.StartARTYear IS NOT NULL');

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
            vlSuppressionByYear.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByYear.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByYear.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionByYear.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByYear
            .groupBy('f.StartARTYear, f.Last12MVLResult')
            .orderBy('f.StartARTYear')
            .getRawMany();
    }
}
