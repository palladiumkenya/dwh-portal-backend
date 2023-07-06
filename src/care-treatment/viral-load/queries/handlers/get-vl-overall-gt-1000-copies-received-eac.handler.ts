import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOverallUptakeGt1000CopiesReceivedEacQuery } from '../impl/get-vl-overall-uptake-gt-1000-copies-received-eac.query';
import { LinelistFACTART } from 'src/care-treatment/common/entities/linelist-fact-art.model';

@QueryHandler(GetVlOverallUptakeGt1000CopiesReceivedEacQuery)
export class GetVlOverallGt1000CopiesReceivedEacHandler
    implements IQueryHandler<GetVlOverallUptakeGt1000CopiesReceivedEacQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}
    //TODO::Add fact Enhanced Ahearacnce counceling
    async execute(
        query: GetVlOverallUptakeGt1000CopiesReceivedEacQuery,
    ): Promise<any> {
        const vlOverallUptakeGt1000 = this.repository
            .createQueryBuilder('art')
            .select([`art.SiteCode, art.PatientPKHash, ValidVLResultCategory1`])
            .where(
                `art.ARTOutcome = 'V' AND DATEDIFF( MONTH, lastVLDate, GETDATE( ) ) <= 14 AND ValidVLResult IS NOT NULL`,
            );

        if (query.county) {
            vlOverallUptakeGt1000.andWhere('art.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlOverallUptakeGt1000.andWhere('art.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlOverallUptakeGt1000.andWhere(
                'art.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlOverallUptakeGt1000.andWhere('art.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlOverallUptakeGt1000.andWhere('art.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeGt1000.andWhere(
                'art.AgeGroup IN (:...ageGroups)',
                {
                    ageGroups: query.datimAgeGroup,
                },
            );
        }

        if (query.gender) {
            vlOverallUptakeGt1000.andWhere('art.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        const originalQuery = vlOverallUptakeGt1000.getQuery;
        const originalParams = vlOverallUptakeGt1000.getParameters;
        vlOverallUptakeGt1000.getQuery = () => {
            const a = originalQuery.call(vlOverallUptakeGt1000);
            return `WITH linelistart AS (${a}),
                eac_source as (
                    SELECT
                        SiteCode,
                        PatientIDHash,
                        PatientPkHash,
                        val,
                        CASE        
                            WHEN cols = 'EAC_VisitDate' THEN 'EACVisitDate_' 
                            WHEN cols = 'SessionNumber' THEN 'SessionNumber_' 
                            WHEN cols = 'EACRecievedVL' THEN 'EACReceivedVL_' 
                        END + CAST(DENSE_RANK () OVER (partition BY SiteCode, PatientPkHash ORDER BY VisitDate ASC ) AS VARCHAR ) AS NUM 
                    FROM
                    (
                        SELECT
                            SiteCode,
                            PatientIDHash,
                            PatientPkHash,
                            VisitDate,
                            CONVERT ( VARCHAR ( 255 ), CAST ( VisitDate AS DATE ) ) AS EAC_VisitDate,
                            CONVERT ( VARCHAR ( 255 ), [SessionNumber] ) AS [SessionNumber],
                            CONVERT ( VARCHAR ( 255 ), [EACRecievedVL] ) AS [EACRecievedVL] 
                        FROM
                            ODS.dbo.CT_EnhancedAdherenceCounselling 
                        WHERE
                            YEAR(VisitDate) > 1900 
                    ) AS Source 
                    UNPIVOT ( val FOR cols IN ( EAC_VisitDate, SessionNumber, EACRecievedVL)) AS unpiv 
                ),
                eac_source_enriched as  (
                    select 
                        *
                    from eac_source as src 
                    PIVOT ( MAX ( val ) FOR NUM IN ( EACVisitDate_1, SessionNumber_1, EACReceivedVL_1, EACVisitDate_2, SessionNumber_2, EACReceivedVL_2, EACVisitDate_3, SessionNumber_3, EACReceivedVL_3 ) ) piv 
                ),
                combined_dataset as (
                    select 
                        EACVisitDate_1,
                        EACVisitDate_2,
                        EACVisitDate_3,
                        ValidVLResultCategory1
                    from linelistart as art
                    left join eac_source_enriched as eac_source_enriched on eac_source_enriched.PatientPkHash = art.PatientPKHash
                        and eac_source_enriched.SiteCode = art.SiteCode
                )
                SELECT 
                    COUNT(EACVisitDate_1) AS EACVisitDate_1,
                    COUNT(EACVisitDate_2) AS EACVisitDate_2,
                    COUNT(EACVisitDate_3) AS EACVisitDate_3 
                FROM combined_dataset 
                WHERE ValidVLResultCategory1 IN ('>1000') 
                GROUP BY ValidVLResultCategory1;`;
        };
        vlOverallUptakeGt1000.getParameters = () => {
            return originalParams.call(vlOverallUptakeGt1000);
        };

        return vlOverallUptakeGt1000.getRawMany();
    }
}
