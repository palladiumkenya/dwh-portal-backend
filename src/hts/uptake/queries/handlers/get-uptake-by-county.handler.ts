import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByCountyQuery } from '../impl/get-uptake-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByCountyQuery)
export class GetUptakeByCountyHandler implements IQueryHandler<GetUptakeByCountyQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ){}

    async execute(query: GetUptakeByCountyQuery): Promise<any> {
        const params = [];
        let uptakeByCountySql = null;

        if(query.county) {
            uptakeByCountySql = ' SELECT `SubCounty` AS County,\n' +
                'SUM(`Tested`) Tested, \n' +
                'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
                '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
                'FROM `fact_htsuptake`\n' +
                'WHERE `SubCounty` IS NOT NULL ';
        } else {
            uptakeByCountySql = 'SELECT \n' +
                '`County`AS County,\n' +
                'SUM(`Tested`) Tested, \n' +
                'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
                '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
                '\n' +
                'FROM `fact_htsuptake`\n' +
                'WHERE `County` IS NOT NULL ';
        }

        if(query.county) {
            uptakeByCountySql = `${uptakeByCountySql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByCountySql = `${uptakeByCountySql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByCountySql = `${uptakeByCountySql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByCountySql = `${uptakeByCountySql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        // if(query.month) {
        //     uptakeByCountySql = `${uptakeByCountySql} and month=?`;
        //     params.push(query.month);
        // }

        // if(query.year) {
        //     uptakeByCountySql = `${uptakeByCountySql} and year=?`;
        //     params.push(query.year);
        // }

        if (query.fromDate) {
            uptakeByCountySql = `${uptakeByCountySql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
            params.push(query.fromDate);
        }

        if (query.toDate) {
            uptakeByCountySql = `${uptakeByCountySql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
            params.push(query.toDate);
        }

        if(query.county) {
            uptakeByCountySql = `${uptakeByCountySql} GROUP BY SubCounty ORDER BY SUM(\`Tested\`) DESC`;
        } else {
            uptakeByCountySql = `${uptakeByCountySql} GROUP BY County ORDER BY SUM(\`Tested\`) DESC`;
        }

        return  await this.repository.query(uptakeByCountySql, params);
    }
}
