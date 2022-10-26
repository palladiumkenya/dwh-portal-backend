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

        const vlOverallUptakeReceivedFollowAll = this.repository
            .createQueryBuilder('cohort')
            .select([
                `MFLCode,cohort.PatientID,County,SubCounty,DOB,gender,c.VL1 as LastVL,c.VL2Date,c.VL1Date,ARTOutcome,
                CASE
                    WHEN ISNUMERIC(VL1)=1
                    THEN
                    CASE
                    WHEN CAST(Replace(VL1,',','')AS FLOAT) <=50.90 THEN '<50 Copies'
                    WHEN CAST(Replace(VL1,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399'
                    WHEN CAST(Replace(VL1,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999'
                    WHEN CAST(Replace(VL1,',','')AS FLOAT) >=1000 THEN '>1000 Copies'
                    END
                    WHEN VL1 IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies'
                    ELSE NULL END AS [LastVLResult],
                        VL1Date as DateLAstVL,
                        VL2,
                        CASE
                    WHEN ISNUMERIC(VL2)=1
                    THEN
                    CASE
                    WHEN CAST(Replace(VL2,',','')AS FLOAT) <=50.90 THEN '<50 Copies'
                    WHEN CAST(Replace(VL2,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399'
                    WHEN CAST(Replace(VL2,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999'
                    WHEN CAST(Replace(VL2,',','')AS FLOAT) >=1000 THEN '>1000 Copies'
                    END
                    WHEN VL2 IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies'
                    ELSE NULL END AS [VL2Result]`,
            ])
            .leftJoin(
                'FACT_VLs',
                'c',
                'cohort.Patientid=c.PatientID and cohort.PatientPK=c.PatientPK and cohort.MFLCode=c.SiteCode',
            );

        if (query.county) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.County IN (:...counties)',
                { counties: query.county },
            );
        }
        
        if (query.subCounty) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }
        
        if (query.facility) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }
        
        if (query.partner) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.CTPartner IN (:...partners)',
                { partners: query.partner },
            );
        }
        
        if (query.agency) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.CTAgency IN (:...agencies)',
                { agencies: query.agency },
            );
        }
        
        if (query.datimAgeGroup) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }
        
        if (query.gender) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }
        
        const originalQuery = vlOverallUptakeReceivedFollowAll.getQuery;
        const originalParams = vlOverallUptakeReceivedFollowAll.getParameters;
        vlOverallUptakeReceivedFollowAll.getQuery = () => {
            const a = originalQuery.call(vlOverallUptakeReceivedFollowAll);
            return `WITH VL AS (${a}) SELECT Count (*) Num FROM VL WHERE  ARTOutcome='V' and  VL2Result   in ('>1000 Copies') and LastVLResult is not null  and DATEDIFF(MONTH,VL2Date,GETDATE())<= 14`;
        };

        vlOverallUptakeReceivedFollowAll.getParameters = () => {
            return originalParams.call(vlOverallUptakeReceivedFollowAll);
        };

        return vlOverallUptakeReceivedFollowAll.getRawMany();
    }
}
