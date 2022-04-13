import {InjectRepository} from '@nestjs/typeorm';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {FactTransNewCohort} from "../../../new-on-art/entities/fact-trans-new-cohort.model";
import { GetVlOverallUptakeReceivedFollowTestsAllQuery} from "../impl/get-vl-overall-uptake-received-follow-tests-all.query";

@QueryHandler(GetVlOverallUptakeReceivedFollowTestsAllQuery)
export class GetVlOverallUptakeReceivedFollowTestsAllHandler implements IQueryHandler<GetVlOverallUptakeReceivedFollowTestsAllQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetVlOverallUptakeReceivedFollowTestsAllQuery): Promise<any> {
        // const vlOverallUptakeAndSuppressionBySex = this.repository.createQueryBuilder('f')
        //     .select(['Last12MVLResult, Gender gender, COUNT ( * ) Num'])
        //     .where('f.MFLCode > 0')
        //     .andWhere('Last12MVLResult IS NOT NULL');

        const vlOverallUptakeReceivedFollowAll = "With VL AS (Select MFLCode, uniqueidno_orig as PatientID, faccounty as County, facSubcounty as SubCounty, DOB, Sex, lastVL1 as LastVL,\tdtlastVL2,\tdtlastVL1, ARTOutcome,\n" +
            "CASE WHEN ISNUMERIC(lastVL1)=1 THEN CASE WHEN CAST(Replace(lastVL1,',','')AS FLOAT) <=50.90 THEN '<50 Copies' WHEN CAST(Replace(lastVL1,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399' WHEN CAST(Replace(lastVL1,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999' WHEN CAST(Replace(lastVL1,',','')AS FLOAT) >=1000 THEN '>1000 Copies' END WHEN lastVL1 IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies' ELSE NULL END AS [LastVLResult], dtlastVL1 as DateLAstVL, lastVl2,\n" +
            "CASE WHEN ISNUMERIC(lastVL2)=1 THEN CASE WHEN CAST(Replace(lastVL2,',','')AS FLOAT) <=50.90 THEN '<50 Copies' WHEN CAST(Replace(lastVL2,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399' WHEN CAST(Replace(lastVL2,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999' WHEN CAST(Replace(lastVL2,',','')AS FLOAT) >=1000 THEN '>1000 Copies' END WHEN lastVL2 IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies' ELSE NULL END AS [LastVL2Result]\n" +
            "from All_Staging_2016_2.dbo.Cohort2015_2016 c)\n" +
            "Select Count (*) Num from VL where ARTOutcome='V' and  LastVL2Result   in ('>1000 Copies') and LastVLResult is not null  and DATEDIFF(MONTH,dtlastVL2,GETDATE())<= 14"

        // if (query.county) {
        //     vlOverallUptakeAndSuppressionBySex.andWhere('f.County IN (:...counties)', {counties: query.county});
        // }
        //
        // if (query.subCounty) {
        //     vlOverallUptakeAndSuppressionBySex.andWhere('f.SubCounty IN (:...subCounties)', {subCounties: query.subCounty});
        // }
        //
        // if (query.facility) {
        //     vlOverallUptakeAndSuppressionBySex.andWhere('f.FacilityName IN (:...facilities)', {facilities: query.facility});
        // }
        //
        // if (query.partner) {
        //     vlOverallUptakeAndSuppressionBySex.andWhere('f.CTPartner IN (:...partners)', {partners: query.partner});
        // }
        //
        // if (query.agency) {
        //     vlOverallUptakeAndSuppressionBySex.andWhere('f.CTAgency IN (:...agencies)', {agencies: query.agency});
        // }
        //
        // if (query.datimAgeGroup) {
        //     vlOverallUptakeAndSuppressionBySex.andWhere('f.AgeGroup IN (:...ageGroups)', {ageGroups: query.datimAgeGroup});
        // }
        //
        // if (query.gender) {
        //     vlOverallUptakeAndSuppressionBySex.andWhere('f.Gender IN (:...genders)', {genders: query.gender});
        // }
        return await this.repository.query(vlOverallUptakeReceivedFollowAll);
    }
}
