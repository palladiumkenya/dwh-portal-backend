import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {
    FactTransHmisStatsTxcurr
} from '../../../../care-treatment/current-on-art/entities/fact-trans-hmis-stats-txcurr.model';
import {Repository} from 'typeorm';
import {FactTransNewlyStarted} from "../../../../care-treatment/new-on-art/entities/fact-trans-newly-started.model";
import {GetTxNewBySexDwhQuery} from "../impl/get-tx-new-by-sex-dwh.query";

@QueryHandler(GetTxNewBySexDwhQuery)
export class GetTxNewBySexDwhHandler implements IQueryHandler<GetTxNewBySexDwhQuery> {
    constructor(
        @InjectRepository(FactTransNewlyStarted, 'mssql')
        private readonly repository: Repository<FactTransNewlyStarted>
    ) {
    }

    async execute(query: GetTxNewBySexDwhQuery): Promise<any> {
        const txNewBySex = this.repository.createQueryBuilder('a')
            .select('a.FacilityName,a.County,a.SubCounty,MFLCode,CTAgency, CTPartner,' +
                'SUM ( CASE WHEN Gender = \'Male\' THEN StartedART ELSE 0 END ) DWHmale,SUM ( CASE WHEN Gender = \'Female\' THEN StartedART ELSE 0 END ) DWHFemale,SUM ( a.StartedART ) DWHtxNew')

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
            txNewBySex.andWhere('a.CTPartner IN (:...partners)', {partners: query.partner});
        }

        if (query.agency) {
            txNewBySex.andWhere('a.CTAgency IN (:...agencies)', {agencies: query.agency});
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

        if(query.month) {
            txNewBySex.andWhere('a.StartART_Month = :month', { month: query.month });
        }

        if(query.year) {
            const yearVal = new Date().getFullYear();
            if(query.year == yearVal && !query.month) {
                txNewBySex.andWhere('a.Start_Year >= :startYear', { startYear: new Date(new Date().setFullYear(new Date().getFullYear() - 1)).getFullYear() });
            } else {
                txNewBySex.andWhere('a.Start_Year = :startYear', { startYear: query.year });
            }
        }

        return await txNewBySex
            .groupBy('a.FacilityName, a.County, a.SubCounty, MFLCode,CTAgency, CTPartner')
            .orderBy('a.FacilityName')
            .getRawMany();
    }
}
