import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrAgeGroupDistributionByCountyQuery } from '../impl/get-ct-tx-curr-age-group-distribution-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateTXCurr } from './../../../../care-treatment/current-on-art/entities/aggregate-txcurr.model';

@QueryHandler(GetCtTxCurrAgeGroupDistributionByCountyQuery)
export class GetCtTxCurrAgeGroupDistributionByCountyHandler implements IQueryHandler<GetCtTxCurrAgeGroupDistributionByCountyQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>
    ) {
    }

    async execute(query: GetCtTxCurrAgeGroupDistributionByCountyQuery): Promise<any> {
        let txCurrAgeGroupDistributionByCounty = this.repository
            .createQueryBuilder('f')
            .select(['[County], SUM([CountClientsTXCur]) txCurr'])
            .where(
                'f.[CountClientsTXCur] IS NOT NULL AND f.DATIMAgeGroup IS NOT NULL',
            );

        if (query.county) {
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
                .andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            txCurrAgeGroupDistributionByCounty
                .andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txCurrAgeGroupDistributionByCounty
                .andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txCurrAgeGroupDistributionByCounty.andWhere(
                'f.DATIMAgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await txCurrAgeGroupDistributionByCounty
            .groupBy('[County]')
            .orderBy('SUM([CountClientsTXCur])', 'DESC')
            .getRawMany();

    }
}
