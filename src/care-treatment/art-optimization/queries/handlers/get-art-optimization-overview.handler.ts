import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetArtOptimizationOverviewQuery } from '../impl/get-art-optimization-overview.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeCurrentRegimens } from '../../entities/aggregate-optimize-current-regimens.model';

@QueryHandler(GetArtOptimizationOverviewQuery)
export class GetArtOptimizationOverviewHandler implements IQueryHandler<GetArtOptimizationOverviewQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeCurrentRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeCurrentRegimens>
    ) {

    }

    async execute(query: GetArtOptimizationOverviewQuery): Promise<any> {
        const artOptimizationOverview = this.repository.createQueryBuilder('f')
            .select(['Agegroup ageGroup, Sex gender, CurrentRegimen currentRegimen, RegimenLine regimenLine, sum(TXCurr) txCurr'])
            .where('SiteCode IS NOT NULL');

        if (query.county) {
            artOptimizationOverview.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            artOptimizationOverview.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            artOptimizationOverview.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            artOptimizationOverview.andWhere('f.PartnerName IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            artOptimizationOverview.andWhere('f.AgencyName IN (:...agency)', { agency: query.agency });
        }

        if (query.gender) {
            artOptimizationOverview.andWhere('f.Sex IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            artOptimizationOverview.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.populationType) {
            artOptimizationOverview.andWhere('f.PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            artOptimizationOverview.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }


        return await artOptimizationOverview
            .groupBy('Agegroup, Sex, CurrentRegimen, RegimenLine')
            .orderBy('Agegroup, Sex, CurrentRegimen, RegimenLine')
            .getRawMany();
    }
}
