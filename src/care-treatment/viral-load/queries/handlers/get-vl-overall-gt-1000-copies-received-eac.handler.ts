import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { GetVlOverallUptakeGt1000CopiesReceivedEacQuery } from '../impl/get-vl-overall-uptake-gt-1000-copies-received-eac.query';

@QueryHandler(GetVlOverallUptakeGt1000CopiesReceivedEacQuery)
export class GetVlOverallGt1000CopiesReceivedEacHandler
    implements IQueryHandler<GetVlOverallUptakeGt1000CopiesReceivedEacQuery> {
    constructor(
        @InjectRepository(FactTransNewCohort, 'mssql')
        private readonly repository: Repository<FactTransNewCohort>,
    ) {}

    async execute(
        query: GetVlOverallUptakeGt1000CopiesReceivedEacQuery,
    ): Promise<any> {
        const vlOverallUptakeGt1000 = this.repository
            .createQueryBuilder('c')
            .select([
                "EACVisitDate_1, EACVisitDate_2, EACVisitDate_3, CASE WHEN ISNUMERIC(LastVL)=1 AND CAST(Replace(LastVL,',','')AS FLOAT) >=1000.00 THEN '>1000 Copies' ELSE NULL END AS Last12MVLResult",
            ])
            .leftJoin(
                '( SELECT * FROM ( SELECT SiteCode, PatientID, PatientPk, val,\n' +
                    'CASE\n' +
                    "\t\t\tWHEN cols = 'EAC_VisitDate' THEN\n" +
                    "\t\t\t'EACVisitDate_' \n" +
                    "\t\t\t\t\t\tWHEN cols = 'SessionNumber' THEN\n" +
                    "\t\t\t\t\t\t'SessionNumber_' \n" +
                    "\t\t\t\t\t\tWHEN cols = 'EACRecievedVL' THEN\n" +
                    "\t\t\t\t\t\t'EACReceivedVL_' \n" +
                    '\t\t\t\t\tEND + CAST ( DENSE_RANK ( ) OVER ( partition BY PatientID, SiteCode, PatientPK ORDER BY VisitDate ASC ) AS VARCHAR ) AS NUM \n' +
                    '\t\t\tFROM ( SELECT\n' +
                    '\t\t\t\t\tSiteCode,\n' +
                    '\t\t\t\t\tPatientID,\n' +
                    '\t\t\t\t\tPatientPk,\n' +
                    '\t\t\t\t\tVisitDate,\n' +
                    '\t\t\t\t\tCONVERT ( VARCHAR ( 255 ), CAST ( VisitDate AS DATE ) ) AS EAC_VisitDate,\n' +
                    '\t\t\t\t\tCONVERT ( VARCHAR ( 255 ), [SessionNumber] ) AS [SessionNumber],\n' +
                    '\t\t\t\t\tCONVERT ( VARCHAR ( 255 ), [EACRecievedVL] ) AS [EACRecievedVL] \n' +
                    '\t\t\t\tFROM\n' +
                    '\t\t\t\t\tPortalDev.dbo.FACT_Trans_EnhancedAdherenceCounselling \n' +
                    '\t\t\t\tWHERE YEAR ( VisitDate ) > 1900 \n' +
                    '\t\t\t\t) AS Source UNPIVOT ( val FOR cols IN ( EAC_VisitDate, SessionNumber, EACRecievedVL ) ) AS unpiv \n' +
                    '\t\t\t) src PIVOT ( MAX ( val ) FOR NUM IN ( EACVisitDate_1, SessionNumber_1, EACReceivedVL_1, EACVisitDate_2, SessionNumber_2, EACReceivedVL_2, EACVisitDate_3, SessionNumber_3, EACReceivedVL_3 ) ) piv \n' +
                    '\t\t)',
                'H',
                'H.PatientPK= c.PatientPK AND H.PatientID= c.PatientID AND H.SiteCode= c.MFLCode',
            )

            .where(
                "ARTOutcome='V' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 and Last12MVLResult is not null",
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
            vlOverallUptakeGt1000.andWhere('c.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlOverallUptakeGt1000.andWhere('c.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeGt1000.andWhere(
                'c.DATIM_AgeGroup IN (:...ageGroups)',
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
