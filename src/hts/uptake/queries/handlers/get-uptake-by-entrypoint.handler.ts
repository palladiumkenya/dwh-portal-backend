import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByEntryPointQuery } from '../impl/get-uptake-by-entrypoint.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsEntryPoint } from '../../entities/fact-hts-entrypoint.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByEntryPointQuery)
export class GetUptakeByEntrypointHandler implements IQueryHandler<GetUptakeByEntryPointQuery> {
    constructor(
        @InjectRepository(FactHtsEntryPoint)
        private readonly repository: Repository<FactHtsEntryPoint>
    ){}

    async execute(query: GetUptakeByEntryPointQuery): Promise<any> {
        const params = [];
        let uptakeByEntryPointSql = 'SELECT \n' +
            '`EntryPoint` AS EntryPoint,\n' +
            'SUM(`Tested`) Tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
            '\n' +
            'FROM `fact_hts_entrypoint`\n' +
            'WHERE `EntryPoint` IS NOT NULL ';

        if(query.county) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeByEntryPointSql = `${uptakeByEntryPointSql} and year=?`;
            params.push(query.year);
        }

        uptakeByEntryPointSql = `${uptakeByEntryPointSql} GROUP BY EntryPoint ORDER BY SUM(\`Tested\`) DESC`;

        return  await this.repository.query(uptakeByEntryPointSql, params);
    }
}
