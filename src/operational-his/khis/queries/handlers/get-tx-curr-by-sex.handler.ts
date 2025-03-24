import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import {GetTxCurrBySexQuery} from "../impl/get-tx-curr-by-sex.query";
import { FactCtDhis2 } from '../../entities/fact-ct-dhis2.model';

@QueryHandler(GetTxCurrBySexQuery)
export class GetTxCurrBySexHandler implements IQueryHandler<GetTxCurrBySexQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetTxCurrBySexQuery): Promise<any> {
        let txCurrBySex = this.repository
            .createQueryBuilder('a')
            .select(
                'a.FacilityName, a.County, a.SubCounty, MFLCode SiteCode,' +
                    'isnull(SUM ( CurrentOnART_Total ), 0) KHIStxCurr,' +
                    'isnull( SUM ( On_ART_10_14_M ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) KHISMale,' +
                    'isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_15_19_F ), 0 ) KHISFemale,' +
                    'isnull( SUM ( On_ART_Under_1 ), 0 ) + isnull( SUM ( On_ART_1_9 ), 0 ) "No gender",' +
                    'isnull( SUM ( On_ART_20_24_F ), 0 ) OnART20_24_F, isnull( SUM ( On_ART_20_24_M ), 0 ) OnART20_24_M, isnull( SUM ( On_ART_25_Plus_F ), 0 ) OnART25_Plus_F, isnull( SUM ( On_ART_25_Plus_M ), 0 ) OnART25_Plus_M,' +
                    'isnull( SUM ( On_ART_10_14_F ), 0 ) OnART10_14_F, isnull( SUM ( On_ART_10_14_M ), 0 ) OnART10_14_M, isnull( SUM ( On_ART_15_19_F ), 0 ) OnART15_19_F, isnull( SUM ( On_ART_15_19_M ), 0 ) OnART15_19_M, isnull(sum(On_ART_1_9), 0) OnART1_9, isnull(sum(On_ART_Under_1), 0) OnARTUnder_1',
            );

        if (
            query.gender &&
            query.gender.includes('Female') &&
            query.gender.includes('Male')
        ) {
            // No action
        } else if (query.gender && query.gender.includes('Female')) {
            txCurrBySex = this.repository
                .createQueryBuilder('a')
                .select(
                    'a.FacilityName,a.County,a.SubCounty, MFLCode SiteCode,' +
                        'isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_15_19_F ), 0 )  KHIStxCurr,' +
                        'isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_15_19_F ), 0 ) KHISFemale,' +
                        'isnull( SUM ( On_ART_Under_1 ), 0 ) + isnull( SUM ( On_ART_1_9 ), 0 ) "No gender"' +
                        ',0 KHISMale,'+
                        'isnull( SUM ( On_ART_20_24_F ), 0 ) OnART20_24_F, 0 OnART20_24_M, isnull( SUM ( On_ART_25_Plus_F ), 0 ) OnART25_Plus_F, 0 OnART25_Plus_M,' +
                        'isnull( SUM ( On_ART_10_14_F ), 0 ) OnART10_14_F, 0 OnART10_14_M, isnull( SUM ( On_ART_15_19_F ), 0 ) OnART15_19_F, 0 OnART15_19_M, 0 OnART1_9, 0 OnARTUnder_1',
                );
        } else if (query.gender && query.gender.includes('Male')) {
            txCurrBySex = this.repository
                .createQueryBuilder('a')
                .select(
                    'a.FacilityName,a.County,a.SubCounty, MFLCode SiteCode,' +
                        'isnull( SUM ( On_ART_10_14_M ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) KHIStxCurr,' +
                        'isnull( SUM ( On_ART_10_14_M ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) KHISMale,' +
                        'isnull( SUM ( On_ART_Under_1 ), 0 ) + isnull( SUM ( On_ART_1_9 ), 0 ) "No gender"' +
                        ',0 KHISFemale,' +
                        '0 OnART20_24_F, isnull( SUM ( On_ART_20_24_M ), 0 ) OnART20_24_M, 0 OnART25_Plus_F, isnull( SUM ( On_ART_25_Plus_M ), 0 ) OnART25_Plus_M,' +
                        '0 OnART10_14_F, isnull( SUM ( On_ART_10_14_M ), 0 ) OnART10_14_M, 0 OnART15_19_F, isnull( SUM ( On_ART_15_19_M ), 0 ) OnART15_19_M, 0 OnART1_9, 0 OnARTUnder_1',
                );
        }

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

        if (query.agency) {
            txCurrBySex
                .andWhere('AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.partner) {
            txCurrBySex
                .andWhere('PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.year) {
            txCurrBySex
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });

        }
        if (query.month) {
            // txCurrBySex.andWhere('StartART_Month = :month', { month: query.month })
        }

        return await txCurrBySex
            .groupBy('a.FacilityName, a.County, a.SubCounty, MFLCode')
            .orderBy('a.FacilityName')
            .getRawMany();
    }
}
