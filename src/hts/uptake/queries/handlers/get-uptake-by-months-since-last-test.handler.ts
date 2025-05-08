import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByMonthsSinceLastTestQuery } from '../impl/get-uptake-by-months-since-last-test.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSMonthsLastTest } from '../../entities/aggregate-hts-months-last-test.model';

@QueryHandler(GetUptakeByMonthsSinceLastTestQuery)
export class GetUptakeByMonthsSinceLastTestHandler
    implements IQueryHandler<GetUptakeByMonthsSinceLastTestQuery> {
    constructor(
        @InjectRepository(AggregateHTSMonthsLastTest, 'mssql')
        private readonly repository: Repository<AggregateHTSMonthsLastTest>,
    ) {}

    async execute(query: GetUptakeByMonthsSinceLastTestQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = this.repository.createQueryBuilder('f')
            .select([`
                MonthLastTest MonthLastTest,
                SUM(Tested)Tested, 
                SUM(Positive) Positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            `])
            .where(`Tested > 0 AND MonthLastTest IS NOT NULL`);

        if (query.county) {
            uptakeByPopulationTypeSql.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            uptakeByPopulationTypeSql.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            uptakeByPopulationTypeSql.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            uptakeByPopulationTypeSql.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.fromDate) {
            uptakeByPopulationTypeSql.andWhere(`year >= ${query.fromDate.substring(0, 4)}`);
            uptakeByPopulationTypeSql.andWhere(`month >= ${query.fromDate.substring(4)}`);
        }

        if (query.toDate) {
            uptakeByPopulationTypeSql.andWhere(
                `year <= ${query.toDate.substring(0, 4)}`,
            );
            uptakeByPopulationTypeSql.andWhere(
                `month <= ${query.toDate.substring(4)}`,
            );
        }

        const resultSet = await uptakeByPopulationTypeSql.groupBy(`MonthLastTest`).getRawMany();

        const returnedVal = [];
        const groupings = [
            '<3 Months',
            '3-6 Months',
            '6-9 Months',
            '9-12 Months',
            '12-18 Months',
            '18-24 Months',
            '24-36 Months',
            '36-48 Months',
            '>48Months',
        ];
        for (let i = 0; i < groupings.length; i++) {
            for (let j = 0; j < resultSet.length; j++) {
                if (resultSet[j].MonthLastTest == groupings[i]) {
                    returnedVal.push(resultSet[j]);
                }
            }
        }

        return returnedVal;
    }
}
