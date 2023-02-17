import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOverallReportingQuery } from '../impl/get-overall-reporting.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { OverallReportingDto } from '../../entities/dtos/overall-reporting.dto';

@QueryHandler(GetOverallReportingQuery)
export class GetOverallReportingHandler
    implements IQueryHandler<GetOverallReportingQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(
        query: GetOverallReportingQuery,
    ): Promise<OverallReportingDto> {
        const params = [];
        params.push(query.docket);
        let overAllReportingSql = `SELECT ${query.reportingType}, COUNT(df.MFLCode) AS facilities_count FROM NDWH.dbo.fact_manifest fm
            INNER JOIN REPORTING.dbo.all_EMRSites df ON df.MFLCode = fm.facilityId
            WHERE docketId = '${query.docket}'`;

        if (query.county) {
            overAllReportingSql = `${overAllReportingSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            overAllReportingSql = `${overAllReportingSql} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            overAllReportingSql = `${overAllReportingSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            overAllReportingSql = `${overAllReportingSql} and Partner IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.agency) {
            overAllReportingSql = `${overAllReportingSql} and agencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            overAllReportingSql = `${overAllReportingSql} AND month(timeId) = ${month} AND year(timeId) = ${year}`;
            params.push(month);
            params.push(year);
        }

        if (query.reportingType) {
            overAllReportingSql = `${overAllReportingSql} GROUP BY ${query.reportingType} ORDER BY ${query.reportingType}`;
        }

        return await this.repository.query(overAllReportingSql, params);
    }
}
