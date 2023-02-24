import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetDWHHTSPOSPositiveQuery } from '../impl/get-dwh-htspos-positive.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactHtsUptakeAgeGender } from '../../../../hts/uptake/entities/fact-htsuptake-agegender.entity';
import { GetDWHHTSTestTrendsQuery } from '../impl/get-dwh-htstest-trends.query';

@QueryHandler(GetDWHHTSTestTrendsQuery)
export class GetDWHHTSTestTrendsHandler
    implements IQueryHandler<GetDWHHTSTestTrendsQuery> {
    constructor(
        @InjectRepository(FactHtsUptakeAgeGender)
        private readonly repository: Repository<FactHtsUptakeAgeGender>,
    ) {}

    async execute(query: GetDWHHTSTestTrendsQuery): Promise<any> {
        const params = [];
        let htsTested = `SELECT 
            year, month, SUM( Tested ) tested
            FROM fact_hts_agegender a WHERE Tested IS NOT NULL `;

        if (query.county) {
            htsTested = `${htsTested} and County IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            htsTested = `${htsTested} and SubCounty IN (?)`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            htsTested = `${htsTested} and FacilityName IN (?)`;
            params.push(query.facility);
        }

        if (query.partner) {
            htsTested = `${htsTested} and CTPartner IN (?)`;
            params.push(query.partner);
        }

        if (query.month) {
            htsTested = `${htsTested} and month=?`;
            params.push(query.month);
        }

        if (query.year) {
            htsTested = `${htsTested} and year=?`;
            params.push(query.year);
        }

        if (query.datimAgeGroup) {
            htsTested = `${htsTested} and EXISTS (SELECT 1 FROM dimagegroups WHERE a.DATIM_AgeGroup = dimagegroups.DATIM_AgeGroup and MOH_AgeGroup IN (?))`;
            params.push(query.datimAgeGroup);
        }

        // if (query.fromDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))>=?`;
        //     params.push(query.fromDate);
        // }

        // if (query.toDate) {
        //     uptakeBySexSql = `${uptakeBySexSql} and CONCAT(year, LPAD(month, 2, '0'))<=?`;
        //     params.push(query.toDate);
        // }

        htsTested = `${htsTested} GROUP BY YEAR, MONTH ORDER BY YEAR, MONTH`;
        return await this.repository.query(htsTested, params);
    }
}
