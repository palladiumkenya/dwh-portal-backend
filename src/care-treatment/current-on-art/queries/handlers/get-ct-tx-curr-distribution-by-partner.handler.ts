import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtTxCurrDistributionByPartnerQuery } from '../impl/get-ct-tx-curr-distribution-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateTXCurr } from '../../entities/aggregate-txcurr.model';

@QueryHandler(GetCtTxCurrDistributionByPartnerQuery)
export class GetCtTxCurrDistributionByPartnerHandler
    implements IQueryHandler<GetCtTxCurrDistributionByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>,
    ) {}

    async execute(query: GetCtTxCurrDistributionByPartnerQuery): Promise<any> {
        const txCurrDistributionByPartner = this.repository
            .createQueryBuilder('f')
            .select(['[PartnerName] CTPartner, SUM(CountClientsTXCur) txCurr'])
            // .innerJoin(DimAgeGroups, 'v', 'f.ageGroup = v.AgeGroup')
            // .where("ARTOutcome ='V' AND ageLV BETWEEN 0 and 120");

        if (query.county) {
            txCurrDistributionByPartner.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            txCurrDistributionByPartner.andWhere(
                'f.Subcounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            txCurrDistributionByPartner.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            txCurrDistributionByPartner.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            txCurrDistributionByPartner.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.gender) {
            txCurrDistributionByPartner.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.datimAgePopulations) {
            if (
                query.datimAgePopulations.includes('>18') &&
                query.datimAgePopulations.includes('<18')
            ) {
            } else if (query.datimAgePopulations.includes('>18'))
                txCurrDistributionByPartner.andWhere('f.ageLV >= 18');
            else if (query.datimAgePopulations.includes('<18'))
                txCurrDistributionByPartner.andWhere('f.ageLV < 18');
        }

        if (query.datimAgeGroup) {
            txCurrDistributionByPartner.andWhere(
                'f.DATIMAgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        return await txCurrDistributionByPartner
            .groupBy('[PartnerName]')
            .orderBy('count(*)', 'DESC')
            .getRawMany();
    }
}
