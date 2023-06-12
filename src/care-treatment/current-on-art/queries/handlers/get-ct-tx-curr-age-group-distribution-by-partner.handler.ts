import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {
    GetCtTxCurrAgeGroupDistributionByPartnerQuery
} from '../impl/get-ct-tx-curr-age-group-distribution-by-partner.query';
import {InjectRepository} from '@nestjs/typeorm';
import {FactTransHmisStatsTxcurr} from '../../entities/fact-trans-hmis-stats-txcurr.model';
import {Repository} from 'typeorm';
import { AggregateTXCurr } from './../../entities/aggregate-txcurr.model';

@QueryHandler(GetCtTxCurrAgeGroupDistributionByPartnerQuery)
export class GetCtTxCurrAgeGroupDistributionByPartnerHandler implements IQueryHandler<GetCtTxCurrAgeGroupDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>
    ) {
    }

    async execute(query: GetCtTxCurrAgeGroupDistributionByPartnerQuery): Promise<any> {
        const txCurrAgeGroupDistributionByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                '[PartnerName] CTPartner, f.[DATIMAgeGroup] ageGroup, Gender, SUM([CountClientsTXCur]) txCurr',
            ])
            // .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
            .where(
                'f.[PartnerName] IS NOT NULL AND f.DATIMAgeGroup IS NOT NULL',
            );

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
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txCurrAgeGroupDistributionByPartner
                .andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txCurrAgeGroupDistributionByPartner.andWhere(
                'f.DATIMAgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await txCurrAgeGroupDistributionByPartner
            .groupBy('[PartnerName], f.[DATIMAgeGroup], Gender')
            .orderBy('SUM([CountClientsTXCur])', 'DESC')
            .getRawMany();
    }
}
