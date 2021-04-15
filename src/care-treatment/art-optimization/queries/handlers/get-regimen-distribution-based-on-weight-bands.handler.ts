import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetRegimenDistributionBasedOnWeightBandsQuery } from '../impl/get-regimen-distribution-based-on-weight-bands.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOptimizeRegLines } from '../../entities/fact-trans-optimize-reg-lines.model';
import { Repository } from 'typeorm';

@QueryHandler(GetRegimenDistributionBasedOnWeightBandsQuery)
export class GetRegimenDistributionBasedOnWeightBandsHandler implements IQueryHandler<GetRegimenDistributionBasedOnWeightBandsQuery> {
    constructor(
        @InjectRepository(FactTransOptimizeRegLines, 'mssql')
        private readonly repository: Repository<FactTransOptimizeRegLines>
    ) {
    }

    async execute(query: GetRegimenDistributionBasedOnWeightBandsQuery): Promise<any> {
        const regimenDistributionBasedOnWeight = this.repository.createQueryBuilder('f')
            .select(['Lastregimen,\n' +
            '\'<20Kgs\' = ISNULL((SELECT SUM([TxCurr]) FROM [dbo].[FACT_TRANS_Optimize_RegLines] y WHERE y.Lastregimen = f.[Lastregimen] and WeightBands = \'<20Kgs\' AND AgeBands in (\'10-14 Years\',\'5-9 Years\',\'2-4 Years\',\'<2 Years\')), 0),\n' +
            '\'20-35Kgs\' = ISNULL((SELECT SUM([TxCurr]) FROM [dbo].[FACT_TRANS_Optimize_RegLines] WHERE Lastregimen = f.[Lastregimen] and WeightBands = \'20-35Kgs\' AND AgeBands in (\'10-14 Years\',\'5-9 Years\',\'2-4 Years\',\'<2 Years\')), 0),\n' +
            '\'>35Kgs\' = ISNULL((SELECT SUM([TxCurr]) FROM [dbo].[FACT_TRANS_Optimize_RegLines] WHERE Lastregimen = f.[Lastregimen] and WeightBands = \'>35Kgs\' AND AgeBands in (\'10-14 Years\',\'5-9 Years\',\'2-4 Years\',\'<2 Years\')), 0)'])
            .where('f.RegimenLine = \'First Regimen Line\' AND f.Lastregimen is not null AND f.AgeBands in (\'10-14 Years\',\'5-9 Years\',\'2-4 Years\',\'<2 Years\')');

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
            regimenDistributionBasedOnWeight.andWhere('f.CTPartner IN (:...partner)', { partner: query.partner });
        }

        return await regimenDistributionBasedOnWeight
            .groupBy('Lastregimen')
            .orderBy('Lastregimen')
            .getRawMany();
    }
}
