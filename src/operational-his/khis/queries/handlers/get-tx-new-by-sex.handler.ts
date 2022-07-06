import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {
    FactTransHmisStatsTxcurr
} from '../../../../care-treatment/current-on-art/entities/fact-trans-hmis-stats-txcurr.model';
import {Repository} from 'typeorm';
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {GetTxNewBySexQuery} from "../impl/get-tx-new-by-sex.query";
import {FactTransNewlyStarted} from "../../../../care-treatment/new-on-art/entities/fact-trans-newly-started.model";

@QueryHandler(GetTxNewBySexQuery)
export class GetTxNewBySexHandler implements IQueryHandler<GetTxNewBySexQuery> {
    constructor(
        @InjectRepository(FactTransNewlyStarted, 'mssql')
        private readonly repository: Repository<FactTransNewlyStarted>
    ) {
    }

    async execute(query: GetTxNewBySexQuery): Promise<any> {
        const txNewBySex = this.repository.createQueryBuilder('a')
            .select('f.FacilityName,f.County,f.SubCounty,[CTPartner],CTAgency,isnull(SUM ( StartedART_Total ),0 ) KHIStxNew,isnull( SUM ( Start_ART_10_14_M ), 0 ) + isnull( SUM (Start_ART_15_19_M ), 0 ) + isnull( SUM ( Start_ART_25_Plus_M ), 0 ) + isnull( SUM ( Start_ART_20_24_M ), 0 ) KHISMale,isnull( SUM ( Start_ART_20_24_F ), 0 ) + isnull( SUM ( Start_ART_25_Plus_F ), 0 ) + isnull( SUM ( Start_ART_10_14_F ), 0 ) + isnull( SUM ( Start_ART_15_19_F ), 0 ) KHISFemale,isnull( SUM ( Start_ART_Under_1 ), 0 ) + isnull( SUM ( Start_ART_1_9 ), 0 ) "No gender",SUM ( CASE WHEN Gender = \'Male\' THEN StartedART ELSE 0 END ) DWHmale,SUM ( CASE WHEN Gender = \'Female\' THEN StartedART ELSE 0 END ) DWHFemale,SUM ( a.StartedART ) DWHtxNew')
            .innerJoin(FactCtDhis2, 'f', 'a.MFLCode = f.SiteCode COLLATE Latin1_General_CI_AS ')
            .where('ReportMonth_Year = :year', { year: query.year });

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
            txNewBySex
                .andWhere('a.ageGroupCleaned IN (:...ageGroups)', {ageGroups: query.datimAgeGroup});
        }

        if (query.gender) {
            txNewBySex.andWhere('a.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await txNewBySex
            .groupBy('f.FacilityName, f.County, f.SubCounty, CTPartner, CTAgency')
            .orderBy('f.FacilityName')
            .getRawMany();
    }
}
