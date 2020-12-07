import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByMonthsSinceLastTestQuery } from '../impl/get-uptake-by-months-since-last-test.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsMonthsLastTest } from '../../entities/fact-hts-monthslasttest.entity';

@QueryHandler(GetUptakeByMonthsSinceLastTestQuery)
export class GetUptakeByMonthsSinceLastTestHandler implements IQueryHandler<GetUptakeByMonthsSinceLastTestQuery> {
    constructor(
        @InjectRepository(FactHtsMonthsLastTest)
        private readonly repository: Repository<FactHtsMonthsLastTest>
    ) {}

    async execute(query: GetUptakeByMonthsSinceLastTestQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = 'SELECT `MonthLastTest` AS MonthLastTest,\n' +
            'SUM(`Tested`) Tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
            'FROM `fact_hts_monthslasttest`\n' +
            'WHERE `MonthLastTest` IS NOT NULL ';

        if(query.county) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and year=?`;
            params.push(query.year);
        }

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY MonthLastTest`;

        const resultSet = await this.repository.query(uptakeByPopulationTypeSql, params);
        const returnedVal = [];
        const groupings = ['<3 Months', '3-6 Months', '6-9 Months', '9-12 Months', '12-18 Months', '18-24 Months', '24-36 Months', '36-48 Months', '>48Months'];
        for(let i = 0; i < groupings.length; i++) {
            for(let j = 0; j < resultSet.length; j ++){
                if(resultSet[j].MonthLastTest == groupings[i]) {
                    returnedVal.push(resultSet[j]);
                }
            }
        }

        return returnedVal;
    }
}
