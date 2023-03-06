import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRegimenDistributionBasedOnWeightBandsQuery } from '../impl/get-regimen-distribution-based-on-weight-bands.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateOptimizeCurrentRegimens } from './../../entities/aggregate-optimize-current-regimens.model';

@QueryHandler(GetRegimenDistributionBasedOnWeightBandsQuery)
export class GetRegimenDistributionBasedOnWeightBandsHandler implements IQueryHandler<GetRegimenDistributionBasedOnWeightBandsQuery> {
    constructor(
        @InjectRepository(AggregateOptimizeCurrentRegimens, 'mssql')
        private readonly repository: Repository<AggregateOptimizeCurrentRegimens>
    ) {
    }

    async execute(query: GetRegimenDistributionBasedOnWeightBandsQuery): Promise<any> {
        const regimenDistributionBasedOnWeight = this.repository
            .createQueryBuilder('f')
            .select([
                `LastRegimenClean Lastregimen,
                '<20Kgs' = ISNULL((SUM(CASE WHEN WeightBands = '<20Kgs' AND AgeBands IN ('10-14 Years','5-9 Years','2-4 Years','<2 Years') THEN [TxCurr] END)), 0),
                '20-35Kgs' = ISNULL((SUM(CASE WHEN WeightBands = '20-35Kgs' AND AgeBands IN ('10-14 Years','5-9 Years','2-4 Years','<2 Years') THEN [TxCurr] END)), 0),
                '>35Kgs' = ISNULL((SUM(CASE WHEN WeightBands = '>35Kgs' AND AgeBands IN ('10-14 Years','5-9 Years','2-4 Years','<2 Years') THEN [TxCurr] END)), 0)`,
            ])
            .where(
                "f.RegimenLine = 'First Regimen Line' AND f.LastRegimenClean is not null AND f.AgeBands in ('10-14 Years','5-9 Years','2-4 Years','<2 Years')",
            );

        if (query.county) {
            regimenDistributionBasedOnWeight.andWhere('f.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            regimenDistributionBasedOnWeight.andWhere('f.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            regimenDistributionBasedOnWeight.andWhere('f.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            regimenDistributionBasedOnWeight.andWhere('f.PartnerName IN (:...partner)', { partner: query.partner });
        }

        if (query.agency) {
            regimenDistributionBasedOnWeight.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            regimenDistributionBasedOnWeight.andWhere('f.Gender IN (:...gender)', { gender: query.gender });
        }

        if (query.datimAgeGroup) {
            regimenDistributionBasedOnWeight.andWhere('f.DATIMAgeGroup IN (:...datimAgeGroup)', { datimAgeGroup: query.datimAgeGroup });
        }

        if (query.populationType) {
            regimenDistributionBasedOnWeight.andWhere('f.PopulationType IN (:...populationType)', { populationType: query.populationType });
        }

        if (query.latestPregnancy) {
            regimenDistributionBasedOnWeight.andWhere('f.LatestPregnancy IN (:...latestPregnancy)', { latestPregnancy: query.latestPregnancy });
        }

        return await regimenDistributionBasedOnWeight
            .groupBy('LastRegimenClean')
            .orderBy('LastRegimenClean')
            .getRawMany();
    }
}
