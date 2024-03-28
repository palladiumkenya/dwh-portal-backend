import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlOverallUptakeGt1000CopiesQuery } from '../impl/get-vl-overall-uptake-gt-1000-copies.query';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetVlOverallUptakeGt1000CopiesQuery)
export class GetVlOverallGt1000CopiesHandler
    implements IQueryHandler<GetVlOverallUptakeGt1000CopiesQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetVlOverallUptakeGt1000CopiesQuery): Promise<any> {
        const vlOverallUptakeGt1000 = this.repository
            .createQueryBuilder('f')
            .select([
                `LastVL, lastVLDate, CASE WHEN ISNUMERIC(ValidVLResult)=1 THEN CASE 
                    WHEN CAST(Replace(ValidVLResult,',','')AS FLOAT) >= 1000 THEN '>1000 Copies' 
                    END
                    ELSE NULL END AS [Last12MVLResult]`,
            ])
            .where("ARTOutcomeDescription ='Active'");

        if (query.county) {
            vlOverallUptakeGt1000.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlOverallUptakeGt1000.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlOverallUptakeGt1000.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlOverallUptakeGt1000.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlOverallUptakeGt1000.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlOverallUptakeGt1000.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            vlOverallUptakeGt1000.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        const originalQuery = vlOverallUptakeGt1000.getQuery;
        const originalParams = vlOverallUptakeGt1000.getParameters;
        vlOverallUptakeGt1000.getQuery = () => {
            const a = originalQuery.call(vlOverallUptakeGt1000);
            return `WITH VL AS (${a}) SELECT Last12MVLResult, Count(*) Num  FROM VL WHERE Last12MVLResult in ('>1000 Copies') Group by Last12MVLResult`;
        };
        vlOverallUptakeGt1000.getParameters = () => {
            return originalParams.call(vlOverallUptakeGt1000);
        };

        return vlOverallUptakeGt1000.getRawMany();
    }
}
