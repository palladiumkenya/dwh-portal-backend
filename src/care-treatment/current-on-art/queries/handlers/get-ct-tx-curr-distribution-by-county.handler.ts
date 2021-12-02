import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrDistributionByCountyQuery } from '../impl/get-ct-tx-curr-distribution-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import { DimAgeGroups } from '../../../common/entities/dim-age-groups.model';

@QueryHandler(GetCtTxCurrDistributionByCountyQuery)
export class GetCtTxCurrDistributionByCountyHandler implements IQueryHandler<GetCtTxCurrDistributionByCountyQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtTxCurrDistributionByCountyQuery): Promise<any> {
        let txCurrDistributionByCounty = this.repository.createQueryBuilder('f')
            .select(['[County],SUM([TXCURR_Total]) txCurr'])
            // .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
            .where('f.[TXCURR_Total] IS NOT NULL');

        if (query.county) {
            txCurrDistributionByCounty = this.repository.createQueryBuilder('f')
                .select(['[Subcounty] County,SUM([TXCURR_Total]) txCurr'])
                .where('f.[TXCURR_Total] IS NOT NULL');

            txCurrDistributionByCounty
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrDistributionByCounty
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrDistributionByCounty
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            txCurrDistributionByCounty
                .andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            txCurrDistributionByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txCurrDistributionByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            /*txCurrDistributionByCounty
                .andWhere('v.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });*/
        }

        if (query.county) {
            return await txCurrDistributionByCounty
                .groupBy('[Subcounty]')
                .orderBy('SUM([TXCURR_Total])', 'DESC')
                .getRawMany();
        } else {
            return await txCurrDistributionByCounty
                .groupBy('[County]')
                .orderBy('SUM([TXCURR_Total])', 'DESC')
                .getRawMany();
        }
    }
}
