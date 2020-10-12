import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrAgeGroupDistributionByPartnerQuery } from '../get-ct-tx-curr-age-group-distribution-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtTxCurrAgeGroupDistributionByPartnerQuery)
export class GetCtTxCurrAgeGroupDistributionByPartnerHandler implements IQueryHandler<GetCtTxCurrAgeGroupDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrAgeGroupDistributionByPartnerQuery): Promise<any> {
        const txCurrAgeGroupDistributionByPartner = this.repository.createQueryBuilder('f')
            .select(['[CTPartner], [ageGroup], Gender, SUM([TXCURR_Total]) txCurr'])
            .where('f.[CTPartner] IS NOT NULL');

        if (query.county) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        return await txCurrAgeGroupDistributionByPartner
            .groupBy('[CTPartner], [ageGroup], Gender')
            .orderBy('[CTPartner]', 'ASC')
            .getRawMany();
    }
}
