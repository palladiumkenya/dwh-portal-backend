import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTxNewByAgeSexQuery } from '../impl/get-tx-new-by-age-sex.query';
import { AggregateCohortRetention } from './../../entities/aggregate-cohort-retention.model';

@QueryHandler(GetTxNewByAgeSexQuery)
export class GetTxNewByAgeSexHandler implements IQueryHandler<GetTxNewByAgeSexQuery> {
    constructor(
        @InjectRepository(AggregateCohortRetention, 'mssql')
        private readonly repository: Repository<AggregateCohortRetention>
    ) {

    }

    async execute(query: GetTxNewByAgeSexQuery): Promise<any> {
        const txNewByAgeSex = this.repository
            .createQueryBuilder('f')
            .select(['[AgeGroup], [Gender], SUM([patients_startedART]) txNew'])
            .where('f.[patients_startedART] > 0')
            .andWhere('f.[AgeGroup] IS NOT NULL')
            .andWhere('f.[Gender] IS NOT NULL');

        if (query.partner) {
            txNewByAgeSex.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }
        
        if (query.county) {
            txNewByAgeSex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txNewByAgeSex.andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txNewByAgeSex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.month) {
            txNewByAgeSex.andWhere(`MONTH (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) = :month`, { month: query.month });
        }

        if (query.agency) {
            txNewByAgeSex.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            txNewByAgeSex.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            txNewByAgeSex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                txNewByAgeSex.andWhere(`YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) >= :startYear`, { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                txNewByAgeSex.andWhere(`YEAR (CAST(REPLACE(StartARTYearMonth , '-', '') + '01' AS DATE)) = :startYear`, { startYear: query.year });
            }
        }

        return await txNewByAgeSex
            .groupBy('f.[AgeGroup], f.[Gender]')
            .orderBy('f.[AgeGroup], f.[Gender]')
            .getRawMany();
    }
}
