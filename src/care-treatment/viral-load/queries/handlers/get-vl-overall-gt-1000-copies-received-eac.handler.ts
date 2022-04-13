import {InjectRepository} from '@nestjs/typeorm';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {FactTransNewCohort} from "../../../new-on-art/entities/fact-trans-new-cohort.model";
import {
    GetVlOverallUptakeGt1000CopiesReceivedEacQuery
} from "../impl/get-vl-overall-uptake-gt-1000-copies-received-eac.query";

@QueryHandler(GetVlOverallUptakeGt1000CopiesReceivedEacQuery)
export class GetVlOverallGt1000CopiesReceivedEacHandler implements IQueryHandler<GetVlOverallUptakeGt1000CopiesReceivedEacQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>
    ) {
    }

    async execute(query: GetVlOverallUptakeGt1000CopiesReceivedEacQuery): Promise<any> {
        const vlOverallUptakeGt1000 = this.repository.createQueryBuilder('f')
            .select(['LastVL, lastVLDate, CASE WHEN ISNUMERIC(LastVL)=1 THEN CASE ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\')AS FLOAT) <=50.90 THEN \'<50 Copies\' ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\') AS FLOAT) between 51.00 and 399.00 THEN \'51-399\' ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\')AS FLOAT) between 400.00 and 999.00 THEN \'400-999\' ' +
            'WHEN CAST(Replace(LastVL,\',\',\'\')AS FLOAT) >=1000 THEN \'>1000 Copies\' ' +
            'END WHEN LastVL IN (\'undetectable\',\'NOT DETECTED\',\'0 copies/ml\',\'LDL\',\'ND\',\'Target Not Detected\',\' Not detected\',\'Target Not Detected.\',\'Less than Low Detectable Level\') THEN \'<50 Copies\' ' +
            'ELSE NULL END AS [Last12MVLResult],  Count(*) Num'])
            .where('ARTOutcome=\'V\' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 and Last12MVLResult in (\'>1000 Copies\')')



        const vlOverallUptakeGt1000Query = "With VL AS (SELECT EACVisitDate_1, EACVisitDate_2, EACVisitDate_3, CASE WHEN ISNUMERIC(LastVL)=1 AND CAST(Replace(LastVL,',','')AS FLOAT) >=1000.00 THEN '>1000 Copies' ELSE NULL END AS Last12MVLResult FROM PortalDev.dbo.Fact_Trans_New_Cohort c LEFT JOIN (SELECT * FROM (\n" +
            "SELECT SiteCode, PatientID, PatientPk, val, Case  WHEN cols='EAC_VisitDate' THEN 'EACVisitDate_' WHEN cols='SessionNumber' THEN 'SessionNumber_' WHEN  cols='EACRecievedVL' THEN 'EACReceivedVL_' End + cast(DENSE_RANK() OVER( partition BY PatientID,SiteCode,PatientPK ORDER BY VisitDate ASC) as varchar)as NUM FROM ( SELECT SiteCode, PatientID, PatientPk ,VisitDate, CONVERT(VARCHAR(20),cast(VisitDate as date)) AS EAC_VisitDate, CONVERT(VARCHAR(20), [SessionNumber]) AS [SessionNumber], CONVERT(VARCHAR(20), [EACRecievedVL]) AS [EACRecievedVL] FROM PortalDev.dbo.FACT_Trans_EnhancedAdherenceCounselling WHERE Year(VisitDate)>1900 ) AS Source UNPIVOT(val FOR cols IN (EAC_VisitDate,SessionNumber, EACRecievedVL)) AS unpiv)src\n" +
            "pivot( MAX(val) for NUM in (EACVisitDate_1,SessionNumber_1,EACReceivedVL_1,EACVisitDate_2,SessionNumber_2,EACReceivedVL_2,EACVisitDate_3,SessionNumber_3,EACReceivedVL_3)) piv ) H on H.PatientPK=c.PatientPK and H.PatientID=c.PatientID and H.SiteCode=c.MFLCode where ARTOutcome='V' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 and Last12MVLResult is not null)\n" +
            "SELECT count (EACVisitDate_1) AS EACVisitDate_1, Count (EACVisitDate_2) AS EACVisitDate_2, count (EACVisitDate_3) As EACVisitDate_3 from VL"

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
