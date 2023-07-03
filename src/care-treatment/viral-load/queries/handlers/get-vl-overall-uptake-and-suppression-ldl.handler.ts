import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlOverallUptakeAndSuppressionLdlQuery } from '../impl/get-vl-overall-uptake-and-suppression-ldl.query';
import { FactTransNewCohort } from '../../../new-on-art/entities/fact-trans-new-cohort.model';
import { LinelistFACTART } from './../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetVlOverallUptakeAndSuppressionLdlQuery)
export class GetVlOverallUptakeAndSuppressionLdlHandler
    implements IQueryHandler<GetVlOverallUptakeAndSuppressionLdlQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(
        query: GetVlOverallUptakeAndSuppressionLdlQuery,
    ): Promise<any> {
        const vlOverallUptakeAndSuppressinLDL = this.repository
            .createQueryBuilder('f')
            .select([
                "LastVL, lastVLDate, CASE WHEN ISNUMERIC(ValidVLResult)=1 THEN CASE WHEN CAST(Replace(ValidVLResult,',','')AS FLOAT) <=50.90 THEN '<50 Copies' WHEN CAST(Replace(ValidVLResult,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399' WHEN CAST(Replace(ValidVLResult,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999' WHEN CAST(Replace(ValidVLResult,',','')AS FLOAT) >=1000 THEN '>1000 Copies' END WHEN ValidVLResult IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies'  ELSE NULL END AS [Last12MVLResult]",
            ])
            .where(
                "ARTOutcome='V' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14",
            );

        // const vlOverallUptakeAndSuppressinLDL = "With VL AS (SELECT LastVL, lastVLDate, CASE  WHEN ISNUMERIC(LastVL)=1  THEN CASE  WHEN CAST(Replace(LastVL,',','')AS FLOAT) <=50.90 THEN '<50 Copies' WHEN CAST(Replace(LastVL,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399' WHEN CAST(Replace(LastVL,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999' WHEN CAST(Replace(LastVL,',','')AS FLOAT) >=1000 THEN '>1000 Copies' END WHEN LastVL IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies' ELSE NULL END AS [Last12MVLResult] FROM PortalDev.dbo.Fact_Trans_New_Cohort where ARTOutcome='V' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 )  SELECT Last12MVLResult, Count(*) Num FROM VL where Last12MVLResult in ('<50 Copies','400-999','51-399') Group by Last12MVLResult"

        if (query.county) {
            vlOverallUptakeAndSuppressinLDL.andWhere(
                'f.County IN (:...counties)',
                { counties: query.county },
            );
        }

        if (query.subCounty) {
            vlOverallUptakeAndSuppressinLDL.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            vlOverallUptakeAndSuppressinLDL.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlOverallUptakeAndSuppressinLDL.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            vlOverallUptakeAndSuppressinLDL.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeAndSuppressinLDL.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                {
                    ageGroups: query.datimAgeGroup,
                },
            );
        }

        if (query.gender) {
            vlOverallUptakeAndSuppressinLDL.andWhere(
                'f.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }

        const originalQuery = vlOverallUptakeAndSuppressinLDL.getQuery;
        const originalParams = vlOverallUptakeAndSuppressinLDL.getParameters;
        vlOverallUptakeAndSuppressinLDL.getQuery = () => {
            const a = originalQuery.call(vlOverallUptakeAndSuppressinLDL);
            return `WITH VL AS (${a}) SELECT Last12MVLResult, Count(*) Num FROM VL WHERE Last12MVLResult in ('<50 Copies','400-999','51-399') Group by Last12MVLResult`;
        };
        vlOverallUptakeAndSuppressinLDL.getParameters = () => {
            return originalParams.call(vlOverallUptakeAndSuppressinLDL);
        };

        return vlOverallUptakeAndSuppressinLDL.getRawMany();
    }
}
