import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetTrendsRecencyQuery } from '../impl/get-trends-recency.query';
import { RecencyUploadsDto } from '../../entities/dtos/recency-uploads.dto';


@QueryHandler(GetTrendsRecencyQuery)
export class GetTrendsRecencyHandler implements IQueryHandler<GetTrendsRecencyQuery> {

    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {
    }

    async execute(query: GetTrendsRecencyQuery): Promise<RecencyUploadsDto> {
        const params = [query.docket];
        let recencySql = 'select * from recency_uploads where docket=?';
        if (query.county) {
            recencySql = `${recencySql} and county=?`;
            params.push(query.county);
        }
        if (query.agency) {
            recencySql = `${recencySql} and agency=?`;
            params.push(query.agency);
        }
        if (query.partner) {
            recencySql = `${recencySql} and partner=?`;
            params.push(query.partner);
        }
        if (query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            recencySql = `${recencySql} and year=? and month=?`;
            params.push(year);
            params.push(month);
        }

        const overallResult = await this.repository.query(recencySql, params);
        return overallResult;
    }
}
