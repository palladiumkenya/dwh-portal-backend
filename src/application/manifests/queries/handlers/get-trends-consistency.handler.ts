import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { GetTrendsConsistencyQuery } from '../get-trends-consistency.query';
import { ConsistencyUploadsDto } from '../../../../entities/manifests/dtos/consistency-uploads.dto';


@QueryHandler(GetTrendsConsistencyQuery)
export class GetTrendsConsistencyHandler implements IQueryHandler<GetTrendsConsistencyQuery> {

    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {
    }

    async execute(query: GetTrendsConsistencyQuery): Promise<ConsistencyUploadsDto> {
        let consistencyResult;
        const params = [query.getDatePeriod(), query.docket];
        const consistencySql = 'call generate_consistency_uploads(?,?)';
        const results = await this.repository.query(consistencySql, params);

        if (results && results[0].length > 0) {
            consistencyResult = results[0];

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
