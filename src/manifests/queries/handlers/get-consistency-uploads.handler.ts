import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetConsistencyUploadsQuery } from '../impl/get-consistency-uploads.query';
import { ConsistencyUploadsTileDto } from '../../entities/dtos/consistency-uploads-tile.dto';

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
                consistencyResult = consistencyResult.filter(x => query.county.indexOf(x.county) !== -1);
            }
            // if (query.subCounty) {
            //     consistencyResult = consistencyResult.filter(x => query.subCounty.indexOf(x.subCounty) !== -1);
            // }
            // if (query.facility) {
            //     consistencyResult = consistencyResult.filter(x => query.facility.indexOf(x.facility) !== -1);
            // }
            if (query.partner) {
                consistencyResult = consistencyResult.filter(x => query.partner.indexOf(x.partner) !== -1);
            }
            if(query.agency) {
                consistencyResult = consistencyResult.filter(x => query.agency.indexOf(x.agency) !== -1);
            }
            totalconsistency = consistencyResult
                .map(this.consistencyCount)
                .reduce(this.consistencySum);
        }
        return new ConsistencyUploadsTileDto(query.docket, totalconsistency);
    }
}
