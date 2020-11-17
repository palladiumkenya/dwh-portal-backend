import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByPartnerQuery } from '../impl/get-uptake-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptake } from '../../entities/fact-htsuptake.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByPartnerQuery)
export class GetUptakeByPartnerHandler implements IQueryHandler<GetUptakeByPartnerQuery> {
    constructor(
        @InjectRepository(FactHtsUptake)
        private readonly repository: Repository<FactHtsUptake>
    ){}

    async execute(query: GetUptakeByPartnerQuery): Promise<any> {
        const params = [];
        let uptakeByPartnerSql = 'SELECT \n' +
            '`CTPartner` AS Partner,\n' +
            'SUM(`Tested`) Tested, \n' +
            'SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END) positive, \n' +
            '((SUM(CASE WHEN `positive` IS NULL THEN 0 ELSE `positive` END)/SUM(`Tested`))*100) AS positivity \n' +
            '\n' +
            'FROM `fact_htsuptake`\n' +
            'WHERE `CTPartner` IS NOT NULL ';

        if(query.county) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeByPartnerSql = `${uptakeByPartnerSql} and year=?`;
            params.push(query.year);
        }

        uptakeByPartnerSql = `${uptakeByPartnerSql} GROUP BY CTPartner ORDER BY SUM(\`Tested\`) DESC`;

        return  await this.repository.query(uptakeByPartnerSql, params);
    }
}
