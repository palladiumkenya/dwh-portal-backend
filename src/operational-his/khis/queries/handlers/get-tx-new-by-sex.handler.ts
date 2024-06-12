import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetTxNewBySexQuery} from "../impl/get-tx-new-by-sex.query";

@QueryHandler(GetTxNewBySexQuery)
export class GetTxNewBySexHandler implements IQueryHandler<GetTxNewBySexQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetTxNewBySexQuery): Promise<any> {
        let txNewBySex = this.repository
            .createQueryBuilder('a')
            .select(
                'a.FacilityName,a.County,a.SubCounty,SiteCode,isnull(SUM ( StartedART_Total ),0 ) KHIStxNew,' +
                    'isnull( SUM ( Start_ART_10_14_M ), 0 ) + isnull( SUM (Start_ART_15_19_M ), 0 ) + isnull( SUM ( Start_ART_25_Plus_M ), 0 ) + isnull( SUM ( Start_ART_20_24_M ), 0 ) KHISMale,' +
                    'isnull( SUM ( Start_ART_20_24_F ), 0 ) + isnull( SUM ( Start_ART_25_Plus_F ), 0 ) + isnull( SUM ( Start_ART_10_14_F ), 0 ) + isnull( SUM ( Start_ART_15_19_F ), 0 ) KHISFemale,' +
                    'isnull( SUM ( Start_ART_Under_1 ), 0 ) + isnull( SUM ( Start_ART_1_9 ), 0 ) "No gender",' +
                    'isnull( SUM ( Start_ART_10_14_M ), 0 ) StartART10_14_M, isnull( SUM (Start_ART_15_19_M ), 0 ) StartART15_19_M, isnull( SUM ( Start_ART_25_Plus_M ), 0 ) StartART25_Plus_M, isnull( SUM ( Start_ART_20_24_M ), 0 ) StartART20_24_M,' +
                    'isnull( SUM ( Start_ART_20_24_F ), 0 ) StartART20_24_F, isnull( SUM (Start_ART_25_Plus_F ), 0 ) StartART25_Plus_F, isnull( SUM ( Start_ART_10_14_F ), 0 ) StartART10_14_F, isnull( SUM ( Start_ART_15_19_F ), 0 ) StartART15_19_F, isnull( SUM ( Start_ART_Under_1 ), 0 ) StartARTUnder_1, isnull( SUM ( Start_ART_1_9 ), 0 ) StartART1_9',
            );


        if (
            query.gender &&
            query.gender.includes('Female') &&
            query.gender.includes('Male')
        ) {
            // No action
        } else if (query.gender && query.gender.includes('Female')) {
            txNewBySex = this.repository
                .createQueryBuilder('a')
                .select(
                    'a.FacilityName,a.County,a.SubCounty,SiteCode,' +
                        'isnull( SUM ( Start_ART_20_24_F ), 0 ) + isnull( SUM ( Start_ART_25_Plus_F ), 0 ) + isnull( SUM ( Start_ART_10_14_F ), 0 ) + isnull( SUM ( Start_ART_15_19_F ), 0 )  KHIStxNew,' +
                        'isnull( SUM ( Start_ART_20_24_F ), 0 ) + isnull( SUM ( Start_ART_25_Plus_F ), 0 ) + isnull( SUM ( Start_ART_10_14_F ), 0 ) + isnull( SUM ( Start_ART_15_19_F ), 0 ) KHISFemale,' +
                        'isnull( SUM ( Start_ART_Under_1 ), 0 ) + isnull( SUM ( Start_ART_1_9 ), 0 ) "No gender"' +
                        ',0 KHISMale, 0 StartARTUnder_1, 0 StartART1_9,' +
                        '0 StartART10_14_M, 0 StartART15_19_M, 0 StartART25_Plus_M, 0 StartART20_24_M,' +
                        'isnull( SUM ( Start_ART_20_24_F ), 0 ) StartART20_24_F, isnull( SUM (Start_ART_25_Plus_F ), 0 ) StartART25_Plus_F, isnull( SUM ( Start_ART_10_14_F ), 0 ) StartART10_14_F, isnull( SUM ( Start_ART_15_19_F ), 0 ) StartART15_19_F',
                );
        } else if (query.gender && query.gender.includes('Male')) {
            txNewBySex = this.repository
                .createQueryBuilder('a')
                .select(
                    'a.FacilityName,a.County,a.SubCounty,SiteCode,' +
                        'isnull( SUM ( Start_ART_20_24_M ), 0 ) + isnull( SUM ( Start_ART_25_Plus_M ), 0 ) + isnull( SUM ( Start_ART_10_14_M ), 0 ) + isnull( SUM ( Start_ART_15_19_M ), 0 )  KHIStxNew,' +
                        'isnull( SUM ( Start_ART_20_24_M ), 0 ) + isnull( SUM ( Start_ART_25_Plus_M ), 0 ) + isnull( SUM ( Start_ART_10_14_M ), 0 ) + isnull( SUM ( Start_ART_15_19_M ), 0 ) KHISMale,' +
                        'isnull( SUM ( Start_ART_Under_1 ), 0 ) + isnull( SUM ( Start_ART_1_9 ), 0 ) "No gender",' +
                        '0 KHISFemale, 0 StartARTUnder_1, 0 StartART1_9,' +
                        'isnull( SUM ( Start_ART_10_14_M ), 0 ) StartART10_14_M, isnull( SUM (Start_ART_15_19_M ), 0 ) StartART15_19_M, isnull( SUM ( Start_ART_25_Plus_M ), 0 ) StartART25_Plus_M, isnull( SUM ( Start_ART_20_24_M ), 0 ) StartART20_24_M,' +
                        '0 StartART20_24_F, 0 StartART25_Plus_F, 0 StartART10_14_F, 0 StartART15_19_F',
                );
        }
        
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

        if (query.year) {
            txNewBySex
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
        }

        return await txNewBySex
            .groupBy('a.FacilityName, a.County, a.SubCounty, SiteCode')
            .orderBy('a.FacilityName')
            .getRawMany();
    }
}
