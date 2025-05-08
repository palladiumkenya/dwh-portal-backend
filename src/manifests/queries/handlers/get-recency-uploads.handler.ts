import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetRecencyUploadsQuery } from '../impl/get-recency-uploads.query';
import { RecencyUploadsTileDto } from '../../entities/dtos/recency-uploads-tile.dto';

@QueryHandler(GetRecencyUploadsQuery)
export class GetRecencyUploadsHandler
    implements IQueryHandler<GetRecencyUploadsQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(
        query: GetRecencyUploadsQuery,
    ): Promise<RecencyUploadsTileDto> {
        const params = [];
        params.push(query.docket);
        const escapeQuotes = (str) => str.replace(/'/g, "''");
        let recencySql = `select sum(recency) as totalrecency from AggregateRecencyUploads where docket='${query.docket}'`;
        if (query.county) {
            recencySql = `${recencySql} and County IN ('${query.county
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.subCounty) {
            recencySql = `${recencySql} and subCounty IN ('${query.subCounty
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.partner) {
            recencySql = `${recencySql} and Partner IN ('${query.partner
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.agency) {
            recencySql = `${recencySql} and agency IN ('${query.agency
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            recencySql = `${recencySql} and year=${year} and month=${month}`;
            params.push(year);
            params.push(month);
        }
        const overallResult = await this.repository.query(recencySql, params);
        return new RecencyUploadsTileDto(
            query.docket,
            +overallResult[0].totalrecency,
        );
    }
}
