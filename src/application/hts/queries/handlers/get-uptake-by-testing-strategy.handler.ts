import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTestingStrategyQuery } from '../get-uptake-by-testing-strategy.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsTeststrategy } from '../../../../entities/hts/fact-hts-teststrategy.entity';
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
            '\n' +
            'FROM `fact_hts_teststrategy` \n' +
            'WHERE `TestStrategy` IS NOT NULL ';

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

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY TestStrategy`;

        return  await this.repository.query(uptakeByPopulationTypeSql, params);
    }
}
