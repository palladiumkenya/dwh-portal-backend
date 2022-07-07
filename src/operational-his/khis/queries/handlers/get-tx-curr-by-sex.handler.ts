import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../care-treatment/current-on-art/entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';
import {GetTxCurrBySexQuery} from "../impl/get-tx-curr-by-sex.query";
import {FactCtDhis2} from "../../entities/fact-ct-dhis2.model";
import {AllEmrSites} from "../../../../care-treatment/common/entities/all-emr-sites.model";

@QueryHandler(GetTxCurrBySexQuery)
export class GetTxCurrBySexHandler implements IQueryHandler<GetTxCurrBySexQuery> {
    constructor(
        @InjectRepository(FactCtDhis2, 'mssql')
        private readonly repository: Repository<FactCtDhis2>
    ) {
    }

    async execute(query: GetTxCurrBySexQuery): Promise<any> {
        const txCurrBySex = this.repository.createQueryBuilder('a')
            .select('a.FacilityName, a.County, a.SubCounty, SiteCode,' +
                'isnull(SUM ( CurrentOnART_Total ), 0) KHIStxCurr, isnull( SUM ( On_ART_10_14_M ), 0 ) + isnull( SUM ( On_ART_15_19_M ), 0 ) + isnull( SUM ( On_ART_25_Plus_M ), 0 ) + isnull( SUM ( On_ART_20_24_M ), 0 ) KHISMale,' +
                'isnull( SUM ( On_ART_20_24_F ), 0 ) + isnull( SUM ( On_ART_25_Plus_F ), 0 ) + isnull( SUM ( On_ART_10_14_F ), 0 ) + isnull( SUM ( On_ART_15_19_F ), 0 ) KHISFemale,' +
                'isnull( SUM ( On_ART_Under_1 ), 0 ) + isnull( SUM ( On_ART_1_9 ), 0 ) "No gender"')
            .leftJoin(AllEmrSites, 'g', 'CAST(g.facilityId as int) = CAST(a.SiteCode as int)')


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
                .andWhere('g.agency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.partner) {
            txCurrBySex
                .andWhere('g.partner IN (:...partners)', { partners: query.partner });
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

        if (query.year) {
            txCurrBySex
                .andWhere('ReportMonth_Year = :year', { year: query.year.toString() + query.month.toString()  });
            // txCurrBySex.andWhere('Start_Year = :year', { year: query.year })
        }
        if (query.month) {
            // txCurrBySex.andWhere('StartART_Month = :month', { month: query.month })
        }

        return await txCurrBySex
            .groupBy('a.FacilityName, a.County, a.SubCounty, SiteCode')
            .orderBy('a.FacilityName')
            .getRawMany();
    }
}
