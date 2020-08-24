import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { GetTrendsConsistencyQuery } from '../get-trends-consistency.query';
import { ConsistencyUploadsDto } from '../../../../entities/manifests/dtos/consistency-uploads.dto';
import moment = require('moment');

@QueryHandler(GetTrendsConsistencyQuery)
export class GetTrendsConsistencyHandler implements IQueryHandler<GetTrendsConsistencyQuery> {

    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {
    }

    async execute(query: GetTrendsConsistencyQuery): Promise<ConsistencyUploadsDto> {
        let consistencyResult;
        let startDate;
        let endDate;

        if(query.endDate) {
            endDate = moment(query.endDate, 'YYYY-MM-DD');
        }

        if(query.startDate) {
            startDate = moment(query.startDate, 'YYYY-MM-DD');
        }

        consistencyResult = [];
        let numberOfMonths = Math.ceil(endDate.diff(startDate, 'months', true));

        for (let i = 0; i < numberOfMonths; i++) {
            let queryDate = startDate.clone().add(i, 'month').format('YYYY-MM-DD');
            let params = [queryDate, query.docket];
            const consistencySql = 'call generate_consistency_uploads(?,?)';
            const results = await this.repository.query(consistencySql, params);
            if (results && results[0].length > 0) {
                consistencyResult = consistencyResult.concat(results[0]);
            }
        }

        if (consistencyResult.length > 0) {
            if (query.county) {
                consistencyResult = consistencyResult.filter(x => x.county === query.county);
            }
            if (query.agency) {
                consistencyResult = consistencyResult.filter(x => x.agency === query.agency);
            }
            if (query.partner) {
                consistencyResult = consistencyResult.filter(x => x.partner === query.partner);
            }
        }
        return consistencyResult;
    }
}
