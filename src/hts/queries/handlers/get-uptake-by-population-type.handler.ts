import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPopulationTypeQuery } from '../impl/get-uptake-by-population-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsPopulationType } from '../../entities/fact-hts-populationtype.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByPopulationTypeQuery)
export class GetUptakeByPopulationTypeHandler implements IQueryHandler<GetUptakeByPopulationTypeQuery> {
    constructor(
        @InjectRepository(FactHtsPopulationType)
        private readonly repository: Repository<FactHtsPopulationType>
    ){}

    async execute(query: GetUptakeByPopulationTypeQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = 'SELECT PopulationType AS PopulationType,  \n' +
            'SUM(`Tested`) Tested,\n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity\n' +
            '\n' +
            'FROM `fact_hts_populationtype` \n' +
            'WHERE `PopulationType` IS NOT NULL OR `PopulationType` IS NULL ';

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

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY PopulationType`;

        return  await this.repository.query(uptakeByPopulationTypeSql, params);
    }

}
