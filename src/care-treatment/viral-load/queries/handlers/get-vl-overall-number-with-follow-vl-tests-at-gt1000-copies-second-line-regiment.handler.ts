import {InjectRepository} from '@nestjs/typeorm';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {FactTransNewCohort} from "../../../new-on-art/entities/fact-trans-new-cohort.model";
import {
    GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery
} from "../impl/get-vl-overall-number-with-follow-tests-at-gt1000-copies-secondline-regiment.query";

@QueryHandler(GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery)
export class GetVlOverallNumberWithFollowVlTestsAtGt1000CopiesSecondLineRegimentHandler implements IQueryHandler<GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetVlOverallNumberWithFollowTestsAtGt1000CopiesSecondlineRegimentQuery): Promise<any> {
        // const vlOverallUptakeAndSuppressionBySex = this.repository.createQueryBuilder('f')
        //     .select(['Last12MVLResult, Gender gender, COUNT ( * ) Num'])
        //     .where('f.MFLCode > 0')
        //     .andWhere('Last12MVLResult IS NOT NULL');

        const vlOverallNumberFollowSecondlineRegiment = "With VL AS (Select MFLCode, uniqueidno_orig as PatientID, faccounty as County, facSubcounty as SubCounty, DOB, Sex, lastVL1 as LastVL, dtlastVL2, dtlastVL1, ARTOutcome, [currentARTline],\n" +
            "CASE WHEN ISNUMERIC(lastVL1)=1 THEN CASE WHEN CAST(Replace(lastVL1,',','')AS FLOAT) <=50.90 THEN '<1000 Copies' WHEN CAST(Replace(lastVL1,',','') AS FLOAT) between 51.00 and 399.00 THEN '<1000 Copies' WHEN CAST(Replace(lastVL1,',','')AS FLOAT) between 400.00 and 999.00 THEN '<1000 Copies' WHEN CAST(Replace(lastVL1,',','')AS FLOAT) >=1000 THEN '>1000 Copies' END\n" +
            "WHEN lastVL1 IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<1000 Copies' ELSE NULL END AS [LastVLResult], dtlastVL1 as DateLAstVL, lastVl2,\n" +
            "CASE WHEN ISNUMERIC(lastVL2)=1 THEN CASE WHEN CAST(Replace(lastVL2,',','')AS FLOAT) <=50.90 THEN '<1000 Copies' WHEN CAST(Replace(lastVL2,',','') AS FLOAT) between 51.00 and 399.00 THEN '<1000 Copies' WHEN CAST(Replace(lastVL2,',','')AS FLOAT) between 400.00 and 999.00 THEN '<1000 Copies' WHEN CAST(Replace(lastVL2,',','')AS FLOAT) >=1000 THEN '>1000 Copies' END WHEN lastVL2 IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<1000 Copies' ELSE NULL END AS [LastVL2Result]\n" +
            "from All_Staging_2016_2.dbo.Cohort2015_2016 c)\n" +
            "Select  LastVL2Result, Count (*) Num from VL where ARTOutcome='V' and  LastVL2Result   in ('>1000 Copies')  and DATEDIFF(MONTH,dtlastVL2,GETDATE())<= 14 and currentARTline='Second Line' group by [LastVL2Result]"

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
        return await this.repository.query(vlOverallNumberFollowSecondlineRegiment);
    }
}
