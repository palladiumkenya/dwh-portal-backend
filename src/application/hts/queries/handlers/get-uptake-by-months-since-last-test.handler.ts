import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByMonthsSinceLastTestQuery } from '../get-uptake-by-months-since-last-test.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsMonthsLastTest } from '../../../../entities/hts/fact-hts-monthslasttest.entity';

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
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and County=?`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and SubCounty=?`;
            params.push(query.subCounty);
        }

        if(query.month) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and month=?`;
            params.push(query.month);
        }

        if(query.partner) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and CTPartner=?`;
            params.push(query.partner);
        }

        if(query.year) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and year=?`;
            params.push(query.year);
        }

        if(query.facility) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and FacilityName=?`;
            params.push(query.facility);
        }

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY MonthLastTest`;

        return  await this.repository.query(uptakeByPopulationTypeSql, params);
    }
}
