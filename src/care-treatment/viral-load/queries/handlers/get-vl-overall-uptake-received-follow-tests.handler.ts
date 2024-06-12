import {InjectRepository} from '@nestjs/typeorm';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import {FactTransNewCohort} from "../../../new-on-art/entities/fact-trans-new-cohort.model";
import {GetVlOverallUptakeReceivedFollowTestsQuery} from "../impl/get-vl-overall-uptake-received-follow-tests.query";
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetVlOverallUptakeReceivedFollowTestsQuery)
export class GetVlOverallUptakeReceivedFollowTestsHandler implements IQueryHandler<GetVlOverallUptakeReceivedFollowTestsQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetVlOverallUptakeReceivedFollowTestsQuery): Promise<any> {
        const vlOverallUptakeReceivedFollow = this.repository
            .createQueryBuilder('cohort')
            .select([
                `SiteCode, cohort.PatientIDHash,cohort.County,cohort.SubCounty,DOB,cohort.Gender,LatestVL1 as LastVL,LatestVLDate2Key,LatestVLDate1Key,ARTOutcomeDescription,
                    CASE
                        WHEN ISNUMERIC(LatestVL1)=1 THEN
                            CASE
                                WHEN CAST(Replace(LatestVL1,',','')AS FLOAT) >=1000 THEN '>1000 Copies'
                                WHEN CAST(Replace(LatestVL1,',','')AS FLOAT) >=200 AND CAST(Replace(LatestVL1,',','')AS FLOAT) < 1000 THEN '200-999'
                        END 
                    END AS [LastVLResult],
                    LatestVLDate1Key as DateLAstVL,
                    LatestVL2,
                    CASE
                        WHEN ISNUMERIC(LatestVL2)=1 THEN
                            CASE
                                WHEN CAST(Replace(LatestVL2,',','')AS FLOAT) >=1000 THEN '>1000 Copies'
                                WHEN CAST(Replace(LatestVL2,',','')AS FLOAT) >=200 AND CAST(Replace(LatestVL2,',','')AS FLOAT) < 1000 THEN '200-999'
                        END
                    END AS [VL2Result]`,
            ])
            .leftJoin(
                'LineListViralLoad',
                'c',
                'cohort.PatientidHash=c.PatientIDHash and cohort.PatientPKHash=c.PatientPKHash and c.MFLCode=cohort.SiteCode',
            );

        if (query.county) {
            vlOverallUptakeReceivedFollow.andWhere(
                'cohort.County IN (:...counties)',
                { counties: query.county },
            );
        }
        
        if (query.subCounty) {
            vlOverallUptakeReceivedFollow.andWhere(
                'cohort.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }
        
        if (query.facility) {
            vlOverallUptakeReceivedFollow.andWhere(
                'cohort.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }
        
        if (query.partner) {
            vlOverallUptakeReceivedFollow.andWhere(
                'cohort.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }
        
        if (query.agency) {
            vlOverallUptakeReceivedFollow.andWhere(
                'cohort.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }
        
        if (query.datimAgeGroup) {
            vlOverallUptakeReceivedFollow.andWhere(
                'cohort.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }
        
        if (query.gender) {
            vlOverallUptakeReceivedFollow.andWhere(
                'cohort.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }
        
        const originalQuery = vlOverallUptakeReceivedFollow.getQuery;
        const originalParams = vlOverallUptakeReceivedFollow.getParameters;
        vlOverallUptakeReceivedFollow.getQuery = () => {
            const a = originalQuery.call(vlOverallUptakeReceivedFollow);
            return `WITH VL AS (${a}) SELECT LastVLResult, Count (*) Num FROM VL WHERE ARTOutcomeDescription ='Active' and VL2Result in ('200-999', '>1000 Copies') and DATEDIFF(MONTH,LatestVLDate2Key,GETDATE())<= 12 group by LastVLResult`;
        };

        vlOverallUptakeReceivedFollow.getParameters = () => {
            return originalParams.call(vlOverallUptakeReceivedFollow);
        };

        return vlOverallUptakeReceivedFollow.getRawMany();
    }
}
