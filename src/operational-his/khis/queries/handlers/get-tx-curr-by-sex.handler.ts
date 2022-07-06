import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../care-treatment/current-on-art/entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import {GetTxCurrBySexQuery} from "../impl/get-tx-curr-by-sex.query";
import {FactHtsDhis2} from "../../entities/fact-hts-dhis2.model";
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";

@QueryHandler(GetTxCurrBySexQuery)
export class GetTxCurrBySexHandler implements IQueryHandler<GetTxCurrBySexQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetTxCurrBySexQuery): Promise<any> {
        const txCurrBySex = this.repository.createQueryBuilder('a')
            .select('f.FacilityName, f.County, f.SubCounty, CTPartner, CTAgency,' +
                'isnull(SUM ( CurrentOnART_Total ), 0) KHIStxCurr, isnull( SUM ( On_ART_10_14_M ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) KHISMale,' +
                'isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_15_19_F ), 0 ) KHISFemale,' +
                'isnull( SUM ( On_ART_Under_1 ), 0 ) + isnull( SUM ( On_ART_1_9 ), 0 ) "No gender", SUM ( CASE WHEN Gender = \'Male\' THEN TXCURR_Total ELSE 0 END ) DWHmale, SUM ( CASE WHEN Gender = \'Female\' THEN TXCURR_Total ELSE 0 END ) DWHFemale, SUM ( a.TXCURR_Total ) DWHtxCurr ')
            .innerJoin(FactCtDhis2, 'f', 'a.MFLCode = f.SiteCode COLLATE Latin1_General_CI_AS ')
            .where('ReportMonth_Year = :year', { year: query.year });

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
            txCurrBySex.andWhere('a.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            txCurrBySex.andWhere('a.CTAgency IN (:...agencies)', { agencies: query.agency });
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
        let a = await txCurrBySex
            .groupBy('f.FacilityName, f.County, f.SubCounty, CTPartner, CTAgency')
            .orderBy('f.FacilityName')
            .getRawMany()
        console.log(a);

        return await txCurrBySex
            .groupBy('f.FacilityName, f.County, f.SubCounty, CTPartner, CTAgency')
            .orderBy('f.FacilityName')
            .getRawMany();
    }
}
