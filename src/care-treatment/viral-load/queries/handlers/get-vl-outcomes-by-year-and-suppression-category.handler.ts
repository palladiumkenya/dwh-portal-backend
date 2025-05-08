import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlOutcomesByYearAndSuppressionCategoryQuery } from '../impl/get-vl-outcomes-by-year-and-suppression-category.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';


@QueryHandler(GetVlOutcomesByYearAndSuppressionCategoryQuery)
export class GetVlOutcomesByYearAndSuppressionCategoryHandler implements IQueryHandler<GetVlOutcomesByYearAndSuppressionCategoryQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetVlOutcomesByYearAndSuppressionCategoryQuery): Promise<any> {
        const vlSuppressionByYear = this.repository
            .createQueryBuilder('f')
            .select([
                'YEAR(StartARTDate) year, ValidVLResultCategory2 last12MVLResult, Count(ValidVLResult) totalSuppressed',
            ])
            .andWhere('f.StartARTDate IS NOT NULL')
            .andWhere('f.isTXCURR > 0');

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
            vlSuppressionByYear.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByYear
            .groupBy('YEAR(StartARTDate), f.ValidVLResultCategory2')
            .orderBy('YEAR(StartARTDate)')
            .getRawMany();
    }
}
