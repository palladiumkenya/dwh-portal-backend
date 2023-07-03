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
            .createQueryBuilder('c')
            .select([
                "EACVisitDate_1, EACVisitDate_2, EACVisitDate_3, CASE WHEN ISNUMERIC(ValidVLResult)=1 AND CAST(Replace(ValidVLResult,',','')AS FLOAT) >=1000.00 THEN '>1000 Copies' ELSE NULL END AS Last12MVLResult",
            ])
            .leftJoin(
                `( SELECT
                    * 
                FROM
                    (
                    SELECT
                        SiteCode,
                        PatientIDHash,
                        PatientPkHash,
                        val,
                    CASE
                            WHEN cols = 'EAC_VisitDate' THEN
                            'EACVisitDate_' 
                            WHEN cols = 'SessionNumber' THEN
                            'SessionNumber_' 
                            WHEN cols = 'EACRecievedVL' THEN
                            'EACReceivedVL_' 
                    END + CAST ( DENSE_RANK ( ) OVER ( partition BY PatientIDHash, SiteCode, PatientPkHash ORDER BY VisitDate ASC ) AS VARCHAR ) AS NUM 
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
                        FROM ODS.dbo.CT_EnhancedAdherenceCounselling 
                        WHERE YEAR ( VisitDate ) > 1900 
                    ) AS Source UNPIVOT ( val FOR cols IN ( EAC_VisitDate, SessionNumber, EACRecievedVL ) ) AS unpiv 
                    ) src PIVOT ( MAX ( val ) FOR NUM IN ( EACVisitDate_1, SessionNumber_1, EACReceivedVL_1, EACVisitDate_2, SessionNumber_2, EACReceivedVL_2, EACVisitDate_3, SessionNumber_3, EACReceivedVL_3 ) ) piv
                    )`,
                'H',
                'H.PatientPKHash= c.PatientPKHash AND H.PatientIDHash= c.PatientIDHash AND H.SiteCode= c.SiteCode',
            )

            .where(
                "ARTOutcome='V' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 and ValidVLResult is not null",
            );

        if (query.county) {
            vlOverallUptakeGt1000.andWhere('c.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlOverallUptakeGt1000.andWhere('c.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlOverallUptakeGt1000.andWhere(
                'c.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlOverallUptakeGt1000.andWhere('c.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlOverallUptakeGt1000.andWhere('c.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeGt1000.andWhere(
                'c.AgeGroup IN (:...ageGroups)',
                {
                    ageGroups: query.datimAgeGroup,
                },
            );
        }

        if (query.gender) {
            vlOverallUptakeGt1000.andWhere('c.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        const originalQuery = vlOverallUptakeGt1000.getQuery;
        const originalParams = vlOverallUptakeGt1000.getParameters;
        vlOverallUptakeGt1000.getQuery = () => {
            const a = originalQuery.call(vlOverallUptakeGt1000);
            return `WITH VL AS (${a}) SELECT count (EACVisitDate_1) AS EACVisitDate_1, Count (EACVisitDate_2) AS EACVisitDate_2, count (EACVisitDate_3) As EACVisitDate_3 FROM VL WHERE Last12MVLResult in ('>1000 Copies') Group by Last12MVLResult`;
        };
        vlOverallUptakeGt1000.getParameters = () => {
            return originalParams.call(vlOverallUptakeGt1000);
        };

        return vlOverallUptakeGt1000.getRawMany();
    }
}
