import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { RecencyByPartnerDto } from '../../entities/dtos/recency-by-partner.dto';
import { GetRecencyByPartnerQuery } from '../impl/get-recency-by-partner.query';

@QueryHandler(GetRecencyByPartnerQuery)
export class GetRecencyByPartnerHandler
    implements IQueryHandler<GetRecencyByPartnerQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(
        query: GetRecencyByPartnerQuery,
    ): Promise<RecencyByPartnerDto> {
        const params = [];
        params.push(query.docket);
        let recencyOfReportingByPartnerSql = `SELECT CASE WHEN b.partner IS NULL OR b.partner = 'NULL' THEN 'No Partner' ELSE b.partner END AS partner
                                    ,CASE WHEN recency IS NULL THEN 0 ELSE recency END AS recency
                                    ,b.expected
                                    ,CASE WHEN recency IS NULL THEN 0 ELSE ROUND(recency * 100 / b.expected, 2) END AS Percentage
                                    FROM (
                                    SELECT SUM(recency) AS recency
                                    ,partner
                                    FROM AggregateRecencyUploads
                                    WHERE docket = '${query.docket}'`;

        if (query.county) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and county IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }

        // if(query.facility) {
        //     recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and facility IN (?)`;
        //     params.push(query.facility);
        // }

        if (query.partner) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and partner IN (?)`;
            params.push(query.partner);
        }

        if (query.agency) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and agency IN (?)`;
            params.push(query.agency);
        }

        if (query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} AND month = ${month} AND year = ${year}`;
            params.push(month);
            params.push(year);
        }

        if (query.docket) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} GROUP BY partner
                                    ) a
                                    RIGHT JOIN (
                                    SELECT SUM(expected) AS expected
                                    ,partner
                                    FROM AggregateExpectedUploads
                                    WHERE docket = '${query.docket}'`;
            params.push(query.docket);
        }

        if (query.county) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and county IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }

        // if(query.facility) {
        //     recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and facility IN (?)`;
        //     params.push(query.facility);
        // }

        if (query.partner) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and partner IN (?)`;
            params.push(query.partner);
        }

        if (query.agency) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and agency IN (?)`;
            params.push(query.agency);
        }

        recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} GROUP BY partner
                                    ) b ON b.partner = a.partner`;

        recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} ORDER BY b.expected DESC`;

        return await this.repository.query(
            recencyOfReportingByPartnerSql,
            params,
        );
    }
}
