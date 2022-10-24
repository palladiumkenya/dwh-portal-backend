import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetLinkageBySexQuery } from '../impl/get-linkage-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../entities/fact-htsuptake-agegender.entity';

@QueryHandler(GetLinkageBySexQuery)
export class GetLinkageBySexHandler implements IQueryHandler<GetLinkageBySexQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>
    ){}

    async execute(query: GetLinkageBySexQuery): Promise<any> {
        const params = [];
        let linkageBySexSql = 'SELECT Gender gender, ' +
            'SUM(Tested) tested, ' +
            'SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) positive, ' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity, ' +
            'SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END) linked, ' +
            '((SUM(CASE WHEN linked IS NULL THEN 0 ELSE linked END)/SUM(positive))*100) AS linkage ' +
            'FROM fact_hts_agegender WHERE positive > 0 ';

        if(query.county) {
            linkageBySexSql = `${linkageBySexSql} and County IN (?)`;
            params.push(query.county);
        }

        if(query.subCounty) {
            linkageBySexSql = `${linkageBySexSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if(query.facility) {
            linkageBySexSql = `${linkageBySexSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if(query.partner) {
            linkageBySexSql = `${linkageBySexSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        // if(query.year) {
        //     linkageBySexSql = `${linkageBySexSql} and year=?`;
        //     params.push(query.year);
        // }

        // if(query.month) {
        //     linkageBySexSql = `${linkageBySexSql} and month=?`;
        //     params.push(query.month);
        // }

        if (query.fromDate) {
            linkageBySexSql = `${linkageBySexSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
            params.push(query.fromDate);
        }

        if (query.toDate) {
            linkageBySexSql = `${linkageBySexSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
            params.push(query.toDate);
        }

        linkageBySexSql = `${linkageBySexSql} GROUP BY Gender`;

        return  await this.repository.query(linkageBySexSql, params);
    }
}
