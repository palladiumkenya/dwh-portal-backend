import {InjectRepository} from '@nestjs/typeorm';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {FactTransVLOverallUptake} from '../../entities/fact-trans-vl-overall-uptake.model';
import {
    GetVlOverallUptakeAndSuppressionLdlQuery
} from "../impl/get-vl-overall-uptake-and-suppression-ldl.query";
import {FactTransNewCohort} from "../../../new-on-art/entities/fact-trans-new-cohort.model";
import {GetVlOverallUptakeGt1000CopiesQuery} from "../impl/get-vl-overall-uptake-gt-1000-copies.query";

@QueryHandler(GetVlOverallUptakeGt1000CopiesQuery)
export class GetVlOverallGt1000CopiesHandler implements IQueryHandler<GetVlOverallUptakeGt1000CopiesQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetVlOverallUptakeGt1000CopiesQuery): Promise<any> {
        const vlOverallUptakeGt1000 = this.repository.createQueryBuilder('f')
            .select(['LastVL, lastVLDate, CASE WHEN ISNUMERIC(LastVL)=1 THEN CASE ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\')AS FLOAT) <=50.90 THEN \'<50 Copies\' ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\') AS FLOAT) between 51.00 and 399.00 THEN \'51-399\' ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\')AS FLOAT) between 400.00 and 999.00 THEN \'400-999\' ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\')AS FLOAT) >=1000 THEN \'>1000 Copies\' ' +
            'END WHEN LastVL IN (\'undetectable\',\'NOT DETECTED\',\'0 copies/ml\',\'LDL\',\'ND\',\'Target Not Detected\',\' Not detected\',\'Target Not Detected.\',\'Less than Low Detectable Level\') THEN \'<50 Copies\' ' +
            'ELSE NULL END AS [Last12MVLResult],  Count(*) Num'])
            .where('ARTOutcome=\'V\' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 and Last12MVLResult in (\'>1000 Copies\')')



        const vlOverallUptakeGt1000Query = "With VL AS (SELECT LastVL, lastVLDate, CASE WHEN ISNUMERIC(LastVL)=1 THEN CASE WHEN CAST(Replace(LastVL,',','')AS FLOAT) <=50.90 THEN '<50 Copies' WHEN CAST(Replace(LastVL,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399' WHEN CAST(Replace(LastVL,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999' WHEN CAST(Replace(LastVL,',','')AS FLOAT) >=1000 THEN '>1000 Copies'\n" +
            "END WHEN LastVL IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies' ELSE NULL END AS [Last12MVLResult] FROM PortalDev.dbo.Fact_Trans_New_Cohort where ARTOutcome='V' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 ) SELECT Last12MVLResult, Count(*) Num FROM VL where Last12MVLResult in ('>1000 Copies') Group by Last12MVLResult"

        if (query.county) {
            vlOverallUptakeGt1000.andWhere('f.County IN (:...counties)', {counties: query.county});
        }

        if (query.subCounty) {
            vlOverallUptakeGt1000.andWhere('f.SubCounty IN (:...subCounties)', {subCounties: query.subCounty});
        }

        if (query.facility) {
            vlOverallUptakeGt1000.andWhere('f.FacilityName IN (:...facilities)', {facilities: query.facility});
        }

        if (query.partner) {
            vlOverallUptakeGt1000.andWhere('f.CTPartner IN (:...partners)', {partners: query.partner});
        }

        if (query.agency) {
            vlOverallUptakeGt1000.andWhere('f.CTAgency IN (:...agencies)', {agencies: query.agency});
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeGt1000.andWhere('f.AgeGroup IN (:...ageGroups)', {ageGroups: query.datimAgeGroup});
        }

        if (query.gender) {
            vlOverallUptakeGt1000.andWhere('f.Gender IN (:...genders)', {genders: query.gender});
        }
        //
        return await this.repository.query(vlOverallUptakeGt1000Query);

        // return await vlOverallUptakeGt1000
        //     .groupBy('Last12MVLResult, LastVL')
        //     .getRawMany();
    }
}
