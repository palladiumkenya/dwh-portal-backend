import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOverallReportingQuery } from '../get-overall-reporting.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { Repository } from 'typeorm';
import { OverallReportingDto } from '../../../../entities/manifests/dtos/overall-reporting.dto';

@QueryHandler(GetOverallReportingQuery)
export class GetOverallReportingHandler implements IQueryHandler<GetOverallReportingQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {
    }

    async execute(query: GetOverallReportingQuery): Promise<OverallReportingDto> {
        const params = [query.docket];

        let overAllReportingSql = `SELECT ${query.reportingType}, COUNT(df.facilityId) AS facilities_count FROM fact_manifest fm
            INNER JOIN dim_time dt ON dt.timeId = fm.timeId
            INNER JOIN dim_facility df ON df.facilityId = fm.facilityId
            WHERE docketId = ?`;

        if (query.agency) {
            overAllReportingSql = `${overAllReportingSql} and agency=?`;
            params.push(query.agency);
        }

        if (query.partner) {
            overAllReportingSql = `${overAllReportingSql} and partner=?`;
            params.push(query.partner);
        }

        if (query.county) {
            overAllReportingSql = `${overAllReportingSql} and county=?`;
            params.push(query.county);
        }

        if (query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            overAllReportingSql = `${overAllReportingSql} AND dt.month = ? AND dt.year = ?\n`;
            params.push(month);
            params.push(year);
        }

        if(query.reportingType) {
            overAllReportingSql = `${overAllReportingSql} GROUP BY ${query.reportingType} ORDER BY ${query.reportingType}`;
        }

        return await this.repository.query(overAllReportingSql, params);
    }
}
