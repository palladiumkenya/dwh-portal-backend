import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {GetTxCurrBySexDwhQuery} from "../impl/get-tx-curr-by-sex-dwh.query";
import { AggregateTXCurr } from '../../../../care-treatment/current-on-art/entities/aggregate-txcurr.model';

@QueryHandler(GetTxCurrBySexDwhQuery)
export class GetTxCurrBySexDwhHandler implements IQueryHandler<GetTxCurrBySexDwhQuery> {
    constructor(
        @InjectRepository(AggregateTXCurr, 'mssql')
        private readonly repository: Repository<AggregateTXCurr>
    ) {
    }

    async execute(query: GetTxCurrBySexDwhQuery): Promise<any> {
        const txCurrBySex = this.repository.createQueryBuilder('a')
            .select('a.FacilityName,a.County,a.SubCounty,MFLCode,AgencyName CTAgency, PartnerName CTPartner,' +
                'SUM ( CASE WHEN Sex = \'Male\' THEN COUNTCLIENTSTXCUR ELSE 0 END ) DWHmale, SUM ( CASE WHEN Sex = \'Female\' THEN COUNTCLIENTSTXCUR ELSE 0 END ) DWHFemale, SUM ( COUNTCLIENTSTXCUR ) DWHtxCurr ')


        if (query.county) {
            txCurrBySex
                .andWhere('a.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            txCurrBySex
                .andWhere('a.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            txCurrBySex
                .andWhere('a.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            txCurrBySex.andWhere('a.PartnerName IN (:...partners)', {partners: query.partner});
        }

        if (query.agency) {
            txCurrBySex.andWhere('a.AgencyName IN (:...agencies)', {agencies: query.agency});
        }

        if (query.datimAgeGroup) {
            txCurrBySex.andWhere(
                'EXISTS (SELECT 1 FROM Dim_AgeGroups WHERE a.ageGroup = Dim_AgeGroups.AgeGroup and MOH_AgeGroup IN (:...ageGroups))',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            txCurrBySex.andWhere('a.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }


        return await txCurrBySex
            .groupBy('a.FacilityName, a.County, a.SubCounty,  MFLCode,AgencyName, PartnerName')
            .orderBy('a.FacilityName')
            .getRawMany();
    }
}
