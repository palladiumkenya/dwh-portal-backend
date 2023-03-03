import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';

import {Repository} from 'typeorm';
import {GetTxNewBySexDwhQuery} from "../impl/get-tx-new-by-sex-dwh.query";
import { AggregateCohortRetention } from 'src/care-treatment/new-on-art/entities/aggregate-cohort-retention.model';

@QueryHandler(GetTxNewBySexDwhQuery)
export class GetTxNewBySexDwhHandler implements IQueryHandler<GetTxNewBySexDwhQuery> {
    constructor(
        @InjectRepository(AggregateCohortRetention, 'mssql')
        private readonly repository: Repository<AggregateCohortRetention>
    ) {
    }

    async execute(query: GetTxNewBySexDwhQuery): Promise<any> {
        const txNewBySex = this.repository.createQueryBuilder('a')
            .select('a.FacilityName,a.County,a.SubCounty,MFLCode, AgencyName CTAgency, PartnerName CTPartner,' +
                'SUM ( CASE WHEN Gender = \'Male\' THEN patients_startedART ELSE 0 END ) DWHmale,SUM ( CASE WHEN Gender = \'Female\' THEN patients_startedART ELSE 0 END ) DWHFemale,SUM ( a.patients_startedART ) DWHtxNew')

        if (query.county) {
            txNewBySex
                .andWhere('a.County IN (:...counties)', {counties: query.county});
        }

        if (query.subCounty) {
            txNewBySex
                .andWhere('a.Subcounty IN (:...subCounties)', {subCounties: query.subCounty});
        }

        if (query.facility) {
            txNewBySex
                .andWhere('a.FacilityName IN (:...facilities)', {facilities: query.facility});
        }

        if (query.partner) {
            txNewBySex.andWhere('a.PartnerName IN (:...partners)', {partners: query.partner});
        }

        if (query.agency) {
            txNewBySex.andWhere('a.AgencyName IN (:...agencies)', {agencies: query.agency});
        }

        if (query.datimAgeGroup) {
            txNewBySex.andWhere(
                'EXISTS (SELECT 1 FROM Dim_AgeGroups WHERE a.AgeGroup = Dim_AgeGroups.DATIM_AgeGroup and MOH_AgeGroup IN (:...ageGroups))',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            txNewBySex.andWhere('a.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        if (query.month && query.year) {
            txNewBySex.andWhere(
                `a.StartARTYearMonth = '${query.year}-${query.month}'`
            );
        }

        // if(query.year) {
        //     const yearVal = new Date().getFullYear();
        //     if(query.year == yearVal && !query.month) {
        //         txNewBySex.andWhere('a.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
        //     } else {
        //         txNewBySex.andWhere('a.Start_Year = :startYear', { startYear: query.year });
        //     }
        // }
        console.log(txNewBySex.getQuery());

        return await txNewBySex
            .groupBy('a.FacilityName, a.County, a.SubCounty, MFLCode,AgencyName, PartnerName')
            .orderBy('a.FacilityName')
            .getRawMany();
    }
}
