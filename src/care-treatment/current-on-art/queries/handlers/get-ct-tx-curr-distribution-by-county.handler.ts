import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrDistributionByCountyQuery } from '../impl/get-ct-tx-curr-distribution-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateTXCurr } from '../../entities/aggregate-txcurr.model';

@QueryHandler(GetCtTxCurrDistributionByCountyQuery)
export class GetCtTxCurrDistributionByCountyHandler
    implements IQueryHandler<GetCtTxCurrDistributionByCountyQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>,
    ) {}

    async execute(query: GetCtTxCurrDistributionByCountyQuery): Promise<any> {
        let txCurrDistributionByCounty = this.repository
            .createQueryBuilder('f')
            .select(['[County],Sum(CountClientsTXCur) txCurr']);

        if (query.county) {
            txCurrDistributionByCounty.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrDistributionByCounty.andWhere(
                'f.Subcounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            txCurrDistributionByCounty.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            txCurrDistributionByCounty.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            txCurrDistributionByCounty.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.gender) {
            txCurrDistributionByCounty.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrDistributionByCounty.andWhere('f.ageLV >= 18');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrDistributionByCounty.andWhere('f.ageLV < 18');
        }

        if (query.datimAgeGroup) {
            txCurrDistributionByCounty.andWhere(
                'f.DATIMAgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await txCurrDistributionByCounty
            .groupBy('[County]')
            .orderBy('count(*)', 'DESC')
            .getRawMany();

    }
}
