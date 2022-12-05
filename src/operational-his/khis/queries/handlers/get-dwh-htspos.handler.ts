import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDWHHTSPOSPositiveQuery } from '../impl/get-dwh-htspos-positive.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../../../hts/uptake/entities/fact-htsuptake-agegender.entity';

@QueryHandler(GetDWHHTSPOSPositiveQuery)
export class GetDWHHTSPOSPositiveHandler
    implements IQueryHandler<GetDWHHTSPOSPositiveQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>,
    ) {}

    async execute(query: GetDWHHTSPOSPositiveQuery): Promise<any> {
        const params = [];
        let uptakeBySexSql =
            'SELECT SUM(Tested) tested, ' +
            'SUM(Positive) positive, ' +
            'SUM( CASE WHEN DATIM_AgeGroup IN ( \'Under 5\', \'5 to 9\', \'10 to 14\' ) THEN Positive ELSE 0 END ) AS children, ' +
            'SUM( CASE WHEN DATIM_AgeGroup IN ( \'10 to 14\', \'15 to 19\' ) THEN Positive ELSE 0 END ) AS adolecent, ' +
            'SUM( CASE WHEN DATIM_AgeGroup IN ( \'15 to 19\', \'20 to 24\', \'25 to 29\', \'30 to 34\', \'35 to 39\', \'40 to 44\', \'45 to 49\', \'50 to 54\', \'55 to 59\', \'60 to 64\', \'65+\' ) THEN Positive ELSE 0  END ) AS adult,' +
            '((SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END)/SUM(Tested))*100) AS positivity ' +
            'FROM fact_hts_agegender WHERE Tested IS NOT NULL ';

        if (query.county) {
            uptakeBySexSql = `${uptakeBySexSql} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            uptakeBySexSql = `${uptakeBySexSql} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            uptakeBySexSql = `${uptakeBySexSql} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if (query.partner) {
            uptakeBySexSql = `${uptakeBySexSql} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if (query.month) {
            uptakeBySexSql = `${uptakeBySexSql} and month=?`;
            params.push(query.month);
        }

        if (query.year) {
            uptakeBySexSql = `${uptakeBySexSql} and year=?`;
            params.push(query.year);
        }

        // if (query.fromDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
        //     params.push(query.fromDate);
        // }

        // if (query.toDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
        //     params.push(query.toDate);
        // }

        uptakeBySexSql = `${uptakeBySexSql}`;
        return await this.repository.query(uptakeBySexSql, params);
    }
}
