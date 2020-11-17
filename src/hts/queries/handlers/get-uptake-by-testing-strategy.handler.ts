import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTestingStrategyQuery } from '../impl/get-uptake-by-testing-strategy.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTeststrategy } from '../../entities/fact-hts-teststrategy.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByTestingStrategyQuery)
export class GetUptakeByTestingStrategyHandler implements IQueryHandler<GetUptakeByTestingStrategyQuery> {
    constructor(
        @InjectRepository(FactHtsTeststrategy)
        private readonly repository: Repository<FactHtsTeststrategy>
    ){}

    async execute(query: GetUptakeByTestingStrategyQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = 'SELECT \n' +
            '`TestStrategy` AS TestStrategy,\n' +
            'SUM(`Tested`) Tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
            'FROM `fact_hts_teststrategy` \n' +
            'WHERE `TestStrategy` IS NOT NULL ';

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

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY TestStrategy ORDER BY SUM(\`Tested\`) DESC`;

        return  await this.repository.query(uptakeByPopulationTypeSql, params);
    }
}
