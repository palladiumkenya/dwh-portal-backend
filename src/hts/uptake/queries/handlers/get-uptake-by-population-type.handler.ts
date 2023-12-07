import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPopulationTypeQuery } from '../impl/get-uptake-by-population-type.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetUptakeByPopulationTypeQuery)
export class GetUptakeByPopulationTypeHandler implements IQueryHandler<GetUptakeByPopulationTypeQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>
    ){}

    async execute(query: GetUptakeByPopulationTypeQuery): Promise<any> {
        const params = [];
        let uptakeByPopulationTypeSql = 'SELECT PopulationType AS PopulationType,  \n' +
            'SUM(`Tested`) Tested,\n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity\n' +
            '\n' +
            'FROM `fact_hts_populationtype` \n' +
            'WHERE `Tested` > 0 and TestType IN (\'Initial\', \'Initial Test\')';

        if(query.county) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if(query.subCounty) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if(query.facility) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if(query.partner) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} and Year=?`;
            params.push(query.year);
        }

        uptakeByPopulationTypeSql = `${uptakeByPopulationTypeSql} GROUP BY PopulationType`;

        return  await this.repository.query(uptakeByPopulationTypeSql, params);
    }

}
