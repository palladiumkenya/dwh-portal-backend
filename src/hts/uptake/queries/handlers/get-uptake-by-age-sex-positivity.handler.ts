import { GetUptakeByAgeSexPositivityQuery } from '../impl/get-uptake-by-age-sex-positivity.query';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetUptakeByAgeSexPositivityQuery)
export class GetUptakeByAgeSexPositivityHandler implements IQueryHandler<GetUptakeByAgeSexPositivityQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ) {}

    async execute(query: GetUptakeByAgeSexPositivityQuery): Promise<any> {
        const params = [];
        let uptakeByAgeSexSql = 'SELECT \n' +
            'DATIM_AgeGroup AS AgeGroup, \n' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity \n' +
            'FROM fact_hts_agegender \n' +
            'WHERE Tested IS NOT NULL ';

        if(query.county) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and year=?`;
            params.push(query.year);
        }

        if (query.fromDate) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
            params.push(query.fromDate);
        }

        if (query.toDate) {
            uptakeByAgeSexSql = `${uptakeByAgeSexSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
            params.push(query.toDate);
        }

        uptakeByAgeSexSql = `${uptakeByAgeSexSql} GROUP BY DATIM_AgeGroup`;
        return  await this.repository.query(uptakeByAgeSexSql, params);
    }
}
