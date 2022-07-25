import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../care-treatment/current-on-art/entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import {GetTxCurrBySexDwhQuery} from "../impl/get-tx-curr-by-sex-dwh.query";

@QueryHandler(GetTxCurrBySexDwhQuery)
export class GetTxCurrBySexDwhHandler implements IQueryHandler<GetTxCurrBySexDwhQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetTxCurrBySexDwhQuery): Promise<any> {
        const txCurrBySex = this.repository.createQueryBuilder('a')
            .select('a.FacilityName,a.County,a.SubCounty,MFLCode,CTAgency, CTPartner,' +
                'SUM ( CASE WHEN Gender = \'Male\' THEN TXCURR_Total ELSE 0 END ) DWHmale, SUM ( CASE WHEN Gender = \'Female\' THEN TXCURR_Total ELSE 0 END ) DWHFemale, SUM ( TXCURR_Total ) DWHtxCurr ')


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
            txCurrBySex.andWhere('a.CTPartner IN (:...partners)', {partners: query.partner});
        }

        if (query.agency) {
            txCurrBySex.andWhere('a.CTAgency IN (:...agencies)', {agencies: query.agency});
        }

        if (query.datimAgeGroup) {
            txCurrBySex
                .andWhere('a.ageGroupCleaned IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            txCurrBySex.andWhere('a.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }


        return await txCurrBySex
            .groupBy('a.FacilityName, a.County, a.SubCounty,  MFLCode,CTAgency, CTPartner')
            .orderBy('a.FacilityName')
            .getRawMany();
    }
}
