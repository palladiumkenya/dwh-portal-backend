import {InjectRepository} from '@nestjs/typeorm';
import {IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {Repository} from 'typeorm';
import { GetVlOverallUptakeReceivedFollowTestsAllQuery} from "../impl/get-vl-overall-uptake-received-follow-tests-all.query";
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetVlOverallUptakeReceivedFollowTestsAllQuery)
export class GetVlOverallUptakeReceivedFollowTestsAllHandler implements IQueryHandler<GetVlOverallUptakeReceivedFollowTestsAllQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>
    ) {
    }

    async execute(query: GetVlOverallUptakeReceivedFollowTestsAllQuery): Promise<any> {
        const vlOverallUptakeReceivedFollowAll = this.repository
            .createQueryBuilder('cohort')
            .select([
                `SiteCode, cohort.PatientIDHash,cohort.County,cohort.SubCounty,DOB,cohort.Sex Gender, c.LatestVL1 as LastVL,c.LatestVLDate2Key,c.LatestVLDate1Key,ARTOutcomeDescription,
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
                'cohort.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            vlOverallUptakeReceivedFollowAll.andWhere(
                'cohort.AgencyName IN (:...agencies)',
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
                'cohort.Sex IN (:...genders)',
                { genders: query.gender },
            );
        }

        const originalQuery = vlOverallUptakeReceivedFollowAll.getQuery;
        const originalParams = vlOverallUptakeReceivedFollowAll.getParameters;
        vlOverallUptakeReceivedFollowAll.getQuery = () => {
            const a = originalQuery.call(vlOverallUptakeReceivedFollowAll);
            return `WITH VL AS (${a}) SELECT Count (*) Num FROM VL WHERE  ARTOutcomeDescription='Active' and  VL2Result in ('200-999', '>1000 Copies') and LastVLResult is not null  and DATEDIFF(MONTH,LatestVLDate2Key,GETDATE())<= 12`;
        };

        vlOverallUptakeReceivedFollowAll.getParameters = () => {
            return originalParams.call(vlOverallUptakeReceivedFollowAll);
        };

        return vlOverallUptakeReceivedFollowAll.getRawMany();
    }
}
