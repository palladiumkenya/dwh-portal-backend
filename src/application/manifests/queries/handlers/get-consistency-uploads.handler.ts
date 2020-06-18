import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { GetConsistencyUploadsQuery } from '../get-consistency-uploads.query';
import { ConsistencyUploadsTileDto } from '../../../../entities/manifests/dtos/consistency-uploads-tile.dto';
import { ConsistencyUploadsDto } from '../../../../entities/manifests/dtos/consistency-uploads.dto';


@QueryHandler(GetConsistencyUploadsQuery)
export class GetConsistencyUploadsHandler implements IQueryHandler<GetConsistencyUploadsQuery> {

    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {
    }


    consistencyCount = (row) => {
        return +row.consistency;
    };

    consistencySum = (prev, next) => {
        return prev + next;
    };

    async execute(query: GetConsistencyUploadsQuery): Promise<ConsistencyUploadsTileDto> {
        let totalconsistency = 0;
        const params = [query.getDatePeriod(), query.docket];
        const consistencySql = 'call generate_consistency_uploads(?,?)';
        const results = await this.repository.query(consistencySql, params);

        if (results && results[0].length > 0) {
            let consistencyResult = results[0];

            if (query.county) {
                consistencyResult = consistencyResult.filter(x => x.county === query.county);
            }
            if (query.agency) {
                consistencyResult = consistencyResult.filter(x => x.agency === query.agency);
            }
            if (query.partner) {
                consistencyResult = consistencyResult.filter(x => x.partner === query.partner);
            }

            totalconsistency = consistencyResult
                .map(this.consistencyCount)
                .reduce(this.consistencySum);
        }
        return new ConsistencyUploadsTileDto(query.docket, totalconsistency);
    }
}
