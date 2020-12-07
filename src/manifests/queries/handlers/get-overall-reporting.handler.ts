import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOverallReportingQuery } from '../impl/get-overall-reporting.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { OverallReportingDto } from '../../entities/dtos/overall-reporting.dto';

@QueryHandler(GetOverallReportingQuery)
export class GetOverallReportingHandler implements IQueryHandler<GetOverallReportingQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {

    }

    async execute(query: GetOverallReportingQuery): Promise<OverallReportingDto> {
        const params = [];
        params.push(query.docket);
        let overAllReportingSql = `SELECT ${query.reportingType}, COUNT(df.facilityId) AS facilities_count FROM fact_manifest fm
            INNER JOIN dim_time dt ON dt.timeId = fm.timeId
            INNER JOIN dim_facility df ON df.facilityId = fm.facilityId
            WHERE docketId = ?`;

        if (query.county) {
            overAllReportingSql = `${overAllReportingSql} and county IN (?)`;
            params.push(query.county);
        }

        if (query.subCounty) {
            overAllReportingSql = `${overAllReportingSql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }

        if (query.facility) {
            overAllReportingSql = `${overAllReportingSql} and name IN (?)`;
            params.push(query.facility);
        }

        if (query.partner) {
            overAllReportingSql = `${overAllReportingSql} and partner IN (?)`;
            params.push(query.partner);
        }

        if (query.agency) {
            overAllReportingSql = `${overAllReportingSql} and agency IN (?)`;
            params.push(query.agency);
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
