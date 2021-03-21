import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrAgeGroupDistributionByCountyQuery } from '../impl/get-ct-tx-curr-age-group-distribution-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtTxCurrAgeGroupDistributionByCountyQuery)
export class GetCtTxCurrAgeGroupDistributionByCountyHandler implements IQueryHandler<GetCtTxCurrAgeGroupDistributionByCountyQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrAgeGroupDistributionByCountyQuery): Promise<any> {
        let txCurrAgeGroupDistributionByCounty = this.repository.createQueryBuilder('f')
            .select(['[County], [ageGroup], Gender, SUM([TXCURR_Total]) txCurr'])
            .where('f.[TXCURR_Total] IS NOT NULL AND ageGroup IS NOT NULL');

        if (query.county) {
            txCurrAgeGroupDistributionByCounty = this.repository.createQueryBuilder('f')
                .select(['[Subcounty] County, [ageGroup], SUM([TXCURR_Total]) txCurr'])
                .where('f.[TXCURR_Total] IS NOT NULL');

            txCurrAgeGroupDistributionByCounty
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrAgeGroupDistributionByCounty
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrAgeGroupDistributionByCounty
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            txCurrAgeGroupDistributionByCounty
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.county) {
            return await txCurrAgeGroupDistributionByCounty
                .groupBy('[Subcounty], [ageGroup]')
                .orderBy('SUM([TXCURR_Total])', 'DESC')
                .getRawMany();
        } else {
            return await txCurrAgeGroupDistributionByCounty
                .groupBy('[County], [ageGroup], Gender')
                .orderBy('SUM([TXCURR_Total])', 'DESC')
                .getRawMany();
        }
    }
}
