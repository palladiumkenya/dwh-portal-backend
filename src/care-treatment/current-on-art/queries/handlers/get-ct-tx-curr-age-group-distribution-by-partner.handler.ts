import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {
    GetCtTxCurrAgeGroupDistributionByPartnerQuery
} from '../impl/get-ct-tx-curr-age-group-distribution-by-partner.query';
import {InjectRepository} from '@nestjs/typeorm';
import {FactTransHmisStatsTxcurr} from '../../entities/fact-trans-hmis-stats-txcurr.model';
import {Repository} from 'typeorm';

@QueryHandler(GetCtTxCurrAgeGroupDistributionByPartnerQuery)
export class GetCtTxCurrAgeGroupDistributionByPartnerHandler implements IQueryHandler<GetCtTxCurrAgeGroupDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrAgeGroupDistributionByPartnerQuery): Promise<any> {
        const txCurrAgeGroupDistributionByPartner = this.repository.createQueryBuilder('f')
            .select(['[CTPartner], f.[ageGroup], Gender, SUM([TXCURR_Total]) txCurr'])
            // .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
            .where('f.[CTPartner] IS NOT NULL AND f.ageGroup IS NOT NULL');

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

        if (query.partner) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.ageGroupCleaned IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await txCurrAgeGroupDistributionByPartner
            .groupBy('[CTPartner], f.[ageGroup], Gender')
            .orderBy('SUM([TXCURR_Total])', 'DESC')
            .getRawMany();
    }
}
