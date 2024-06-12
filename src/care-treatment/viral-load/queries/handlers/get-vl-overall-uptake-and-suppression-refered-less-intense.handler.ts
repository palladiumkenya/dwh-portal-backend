import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOverallUptakeAndSuppressionReferredLessIntenseQuery } from '../impl/get-vl-overall-uptake-and-suppression-referred-less-intense.query';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetVlOverallUptakeAndSuppressionReferredLessIntenseQuery)
export class GetVlOverallUptakeAndSuppressionReferedLessIntenseHandler
    implements
        IQueryHandler<
            GetVlOverallUptakeAndSuppressionReferredLessIntenseQuery
        > {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(
        query: GetVlOverallUptakeAndSuppressionReferredLessIntenseQuery,
    ): Promise<any> {
        const vlOverallUptakeAndSuppressionLessIntense = this.repository
            .createQueryBuilder('f')
            .select([
                `LastVL, lastVLDate, CASE 
                    WHEN ISNUMERIC(LastVL)=1 THEN 
                        CASE 
                            WHEN CAST(Replace(LastVL,',','')AS FLOAT) <=50.90 THEN '<50 Copies' 
                            WHEN CAST(Replace(LastVL,',','') AS FLOAT) between 51.00 and 399.00 THEN '51-399' 
                            WHEN CAST(Replace(LastVL,',','')AS FLOAT) between 400.00 and 999.00 THEN '400-999' 
                            WHEN CAST(Replace(LastVL,',','')AS FLOAT) >=1000 THEN '>1000 Copies' 
                        END 
                            WHEN LastVL IN ('undetectable','NOT DETECTED','0 copies/ml','LDL','ND','Target Not Detected',' Not detected','Target Not Detected.','Less than Low Detectable Level') THEN '<50 Copies' 
                        ELSE NULL 
                    END 
                AS [Last12MVLResult], 
                DifferentiatedCare`,
            ])
            .where(
                "ARTOutcomeDescription ='Active' and DATEDIFF(MONTH,lastVLDate,GETDATE())<= 14 and DifferentiatedCare<>'Not Documented'",
            );

        if (query.county) {
            vlOverallUptakeAndSuppressionLessIntense.andWhere(
                'f.County IN (:...counties)',
                { counties: query.county },
            );
        }

        if (query.subCounty) {
            vlOverallUptakeAndSuppressionLessIntense.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            vlOverallUptakeAndSuppressionLessIntense.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlOverallUptakeAndSuppressionLessIntense.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            vlOverallUptakeAndSuppressionLessIntense.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeAndSuppressionLessIntense.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            vlOverallUptakeAndSuppressionLessIntense.andWhere(
                'f.Gender IN (:...genders)',
                { genders: query.gender },
            );
        }

        const originalQuery = vlOverallUptakeAndSuppressionLessIntense.getQuery;
        const originalParams =
            vlOverallUptakeAndSuppressionLessIntense.getParameters;
        vlOverallUptakeAndSuppressionLessIntense.getQuery = () => {
            const a = originalQuery.call(
                vlOverallUptakeAndSuppressionLessIntense,
            );
            return `WITH DC AS (${a}) SELECT count (DifferentiatedCare) Num FROM DC WHERE Last12MVLResult in ('<50 Copies','400-999','51-399')`;
        };
        vlOverallUptakeAndSuppressionLessIntense.getParameters = () => {
            return originalParams.call(
                vlOverallUptakeAndSuppressionLessIntense,
            );
        };

        return vlOverallUptakeAndSuppressionLessIntense.getRawMany();
    }
}
