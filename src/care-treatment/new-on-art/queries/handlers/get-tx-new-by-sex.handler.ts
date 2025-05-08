import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTxNewBySexQuery } from '../impl/get-tx-new-by-sex.query';
import { AggregateCohortRetention } from '../../entities/aggregate-cohort-retention.model';

@QueryHandler(GetTxNewBySexQuery)
export class GetTxNewBySexHandler implements IQueryHandler<GetTxNewBySexQuery> {
    constructor(
        @InjectRepository(AggregateCohortRetention, 'mssql')
        private readonly repository: Repository<AggregateCohortRetention>
    ) {

    }

    async execute(query: GetTxNewBySexQuery): Promise<any> {
        const txNewBySex = this.repository
            .createQueryBuilder('f')
            .select(['Sex Gender, SUM([patients_startedART]) txNew'])
            .where('f.[patients_startedART] > 0')
            .andWhere('f.[Sex] IS NOT NULL');

        if (query.partner) {
            txNewBySex.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.county) {
            txNewBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txNewBySex.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txNewBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.month) {
            txNewBySex.andWhere(
                `MONTH (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) = :month`,
                { month: query.month },
            );
        }

        if (query.agency) {
            txNewBySex.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txNewBySex.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txNewBySex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                txNewBySex.andWhere(`YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) >= :startYear`, { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                txNewBySex.andWhere(
                    `YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) = :startYear`,
                    { startYear: query.year },
                );
            }
        }

        return await txNewBySex
            .groupBy('f.[Sex]')
            .orderBy('f.[Sex]')
            .getRawMany();
    }
}
