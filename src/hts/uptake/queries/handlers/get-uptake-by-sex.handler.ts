import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeBySexQuery } from '../impl/get-uptake-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';

@QueryHandler(GetUptakeBySexQuery)
export class GetUptakeBySexHandler implements IQueryHandler<GetUptakeBySexQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ){}

    async execute(query: GetUptakeBySexQuery): Promise<any> {
        const params = [];
        let uptakeBySexSql = 'SELECT Gender gender, ' +
            'SUM(Tested) tested, ' +
            'SUM(Positive) positive, ' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity ' +
            'FROM fact_hts_agegender WHERE Tested IS NOT NULL ';

        if(query.county) {
            uptakeBySexSql = `${uptakeBySexSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            uptakeBySexSql = `${uptakeBySexSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            uptakeBySexSql = `${uptakeBySexSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            uptakeBySexSql = `${uptakeBySexSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if(query.month) {
            uptakeBySexSql = `${uptakeBySexSql} and month=?`;
            params.push(query.month);
        }

        if(query.year) {
            uptakeBySexSql = `${uptakeBySexSql} and year=?`;
            params.push(query.year);
        }

        uptakeBySexSql = `${uptakeBySexSql} GROUP BY Gender`;
        return  await this.repository.query(uptakeBySexSql, params);
    }
}
