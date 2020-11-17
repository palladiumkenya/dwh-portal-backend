import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { RecencyByPartnerDto } from '../../entities/dtos/recency-by-partner.dto';
import { GetRecencyByPartnerQuery } from '../impl/get-recency-by-partner.query';

@QueryHandler(GetRecencyByPartnerQuery)
export class GetRecencyByPartnerHandler implements IQueryHandler<GetRecencyByPartnerQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {
    }

    async execute(query: GetRecencyByPartnerQuery): Promise<RecencyByPartnerDto> {
        const params = [query.docket];

        let recencyOfReportingByPartnerSql = `SELECT a.partner
                                    \t,recency
                                    \t,b.expected
                                    \t,ROUND(recency * 100 / b.expected) AS Percentage
                                    FROM (
                                    \tSELECT SUM(recency) AS recency
                                    \t\t,partner
                                    \tFROM recency_uploads
                                    \tWHERE docket = ?`;

        if (query.agency) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and agency=?`;
            params.push(query.agency);
        }

        if(query.county) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and county=?`;
            params.push(query.county);
        }

        if(query.partner) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and partner=?`;
            params.push(query.partner);
        }

        if(query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} AND month = ? AND year = ?\n`;
            params.push(month);
            params.push(year);
        }

        if (query.docket) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} GROUP BY partner
                                    \t) a
                                    INNER JOIN (
                                    \tSELECT SUM(expected) AS expected
                                    \t\t,partner
                                    \tFROM expected_uploads
                                    \tWHERE docket = ?`;
            params.push(query.docket);
        }

        if (query.agency) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and agency=?`;
            params.push(query.agency);
        }

        if(query.county) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and county=?`;
            params.push(query.county);
        }

        if(query.partner) {
            recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} and partner=?`;
            params.push(query.partner);
        }

        recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} GROUP BY partner
                                    \t) b ON b.partner = a.partner`;

        recencyOfReportingByPartnerSql = `${recencyOfReportingByPartnerSql} ORDER BY ROUND(recency * 100 / b.expected) DESC`;

        return await this.repository.query(recencyOfReportingByPartnerSql, params);
    }
}
