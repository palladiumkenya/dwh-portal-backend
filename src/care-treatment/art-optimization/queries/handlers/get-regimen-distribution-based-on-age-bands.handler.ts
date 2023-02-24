import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRegimenDistributionBasedOnAgeBandsQuery } from '../impl/get-regimen-distribution-based-on-age-bands.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeRegLines } from '../../entities/fact-trans-optimize-reg-lines.model';
import { Repository } from 'typeorm';
import { AggregateOptimizeCurrentRegimens } from './../../entities/aggregate-optimize-current-regimens.model';

@QueryHandler(GetRegimenDistributionBasedOnAgeBandsQuery)
export class GetRegimenDistributionBasedOnAgeBandsHandler implements IQueryHandler<GetRegimenDistributionBasedOnAgeBandsQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeCurrentRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeCurrentRegimens>
    ) {
    }

    async execute(query: GetRegimenDistributionBasedOnAgeBandsQuery): Promise<any> {
        const regimenDistributionBasedOnAgeBands = this.repository
            .createQueryBuilder('f')
            .select([
                '[LastRegimenClean] Lastregimen,' +
                    "'<2 Years' = ISNULL((SELECT SUM([TXCurr]) FROM [dbo].[AggregateOptimizeCurrentRegimens] y WHERE y.LastRegimenClean = f.[LastRegimenClean] and [AgeBands] = '<2 Years'), 0)," +
                    "'2-4 Years' = ISNULL((SELECT SUM([TXCurr]) FROM [dbo].[AggregateOptimizeCurrentRegimens] WHERE LastRegimenClean = f.[LastRegimenClean] and [AgeBands] = '2-4 Years'), 0)," +
                    "'5-9 Years' = ISNULL((SELECT SUM([TXCurr]) FROM [dbo].[AggregateOptimizeCurrentRegimens] WHERE LastRegimenClean = f.[LastRegimenClean] and [AgeBands] = '5-9 Years'), 0)," +
                    "'10-14 Years' = ISNULL((SELECT SUM([TXCurr]) FROM [dbo].[AggregateOptimizeCurrentRegimens] WHERE LastRegimenClean = f.[LastRegimenClean] and [AgeBands] = '10-14 Years'), 0)," +
                    "'Grand Total' = ISNULL((SELECT SUM([TXCurr]) FROM [dbo].[AggregateOptimizeCurrentRegimens] WHERE LastRegimenClean = f.[LastRegimenClean] and [AgeBands] IN ('<2 Years', '2-4 Years', '5-9 Years', '10-14 Years')), 0)",
            ])
            .where(
                "f.RegimenLine = 'First Regimen Line' AND f.LastRegimenClean is not null AND f.AgeBands in ('10-14 Years','5-9 Years','2-4 Years','<2 Years')",
            );

        if (query.county) {
            regimenDistributionBasedOnAgeBands.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            regimenDistributionBasedOnAgeBands.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            regimenDistributionBasedOnAgeBands.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            regimenDistributionBasedOnAgeBands.andWhere('f.PartnerName IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            regimenDistributionBasedOnAgeBands.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            regimenDistributionBasedOnAgeBands.andWhere('f.Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            regimenDistributionBasedOnAgeBands.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.populationType) {
            regimenDistributionBasedOnAgeBands.andWhere('f.PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            regimenDistributionBasedOnAgeBands.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await regimenDistributionBasedOnAgeBands
            .groupBy('LastRegimenClean')
            .orderBy('LastRegimenClean')
            .getRawMany();
    }
}
