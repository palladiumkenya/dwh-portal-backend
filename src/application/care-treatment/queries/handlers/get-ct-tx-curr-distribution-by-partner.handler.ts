import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrDistributionByPartnerQuery } from '../get-ct-tx-curr-distribution-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtTxCurrDistributionByPartnerQuery)
export class GetCtTxCurrDistributionByPartnerHandler implements IQueryHandler<GetCtTxCurrDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrDistributionByPartnerQuery): Promise<any> {
        const txCurrDistributionByPartner = this.repository.createQueryBuilder('f')
            .select(['[CTPartner],SUM([TXCURR_Total]) txCurr'])
            .where('f.[TXCURR_Total] IS NOT NULL');

        if (query.county) {
            txCurrDistributionByPartner
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrDistributionByPartner
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrDistributionByPartner
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        return await txCurrDistributionByPartner
            .groupBy('[CTPartner]')
            .orderBy('SUM([TXCURR_Total])', 'ASC')
            .getRawMany();
    }
}
