import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetConsistencyByCountyQuery } from '../get-consistency-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { Repository } from 'typeorm';
import { ConsistencyByCountyDto } from '../../../../entities/manifests/dtos/consistency-by-county.dto';

@QueryHandler(GetConsistencyByCountyQuery)
export class GetConsistencyByCountyHandler implements IQueryHandler<GetConsistencyByCountyQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {
    }

    async execute(query: GetConsistencyByCountyQuery): Promise<ConsistencyByCountyDto> {
        const params = [query.docket];

        let recencyOfReportingByCountySql = `SELECT a.county
                                    \t,recency
                                    \t,b.expected
                                    \t,ROUND(recency * 100 / b.expected) AS Percentage
                                    FROM (
                                    \tSELECT SUM(recency) AS recency
                                    \t\t,county
                                    \tFROM recency_uploads
                                    \tWHERE docket = ?`;

        if (query.agency) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and agency=?`;
            params.push(query.agency);
        }

        if(query.county) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and county=?`;
            params.push(query.county);
        }

        if(query.partner) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and partner=?`;
            params.push(query.partner);
        }

        if(query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} AND month = ? AND year = ?\n`;
            params.push(month);
            params.push(year);
        }

        if (query.docket) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} GROUP BY county
                                    \t) a
                                    INNER JOIN (
                                    \tSELECT SUM(expected) AS expected
                                    \t\t,county
                                    \tFROM expected_uploads
                                    \tWHERE docket = ?`;
            params.push(query.docket);
        }

        if (query.agency) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and agency=?`;
            params.push(query.agency);
        }

        if(query.county) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and county=?`;
            params.push(query.county);
        }

        if(query.partner) {
            recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} and partner=?`;
            params.push(query.partner);
        }

        recencyOfReportingByCountySql = `${recencyOfReportingByCountySql} GROUP BY county
                                    \t) b ON b.county = a.county`;

        return await this.repository.query(recencyOfReportingByCountySql, params);
    }
}
