import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetRecencyUploadsQuery } from '../impl/get-recency-uploads.query';
import { RecencyUploadsTileDto } from '../../entities/dtos/recency-uploads-tile.dto';

@QueryHandler(GetRecencyUploadsQuery)
export class GetRecencyUploadsHandler implements IQueryHandler<GetRecencyUploadsQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {

    }

    async execute(query: GetRecencyUploadsQuery): Promise<RecencyUploadsTileDto> {
        const params = [];
        params.push(query.docket);
        let recencySql = 'select sum(recency) as totalrecency from recency_uploads where docket=?';
        if (query.county) {
            recencySql = `${recencySql} and county IN (?)`;
            params.push(query.county);
        }
        if (query.subCounty) {
            recencySql = `${recencySql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }
        // if (query.facility) {
        //     recencySql = `${recencySql} and facility IN (?)`;
        //     params.push(query.facility);
        // }
        if (query.partner) {
            recencySql = `${recencySql} and partner IN (?)`;
            params.push(query.partner);
        }
        if (query.agency) {
            recencySql = `${recencySql} and agency IN (?)`;
            params.push(query.agency);
        }
        if (query.period) {
            const year=query.period.split(',')[0];
            const month=query.period.split(',')[1];
            recencySql = `${recencySql} and year=? and month=?`;
            params.push(year);
            params.push(month);
        }
        const overallResult = await this.repository.query(recencySql, params);
        return new RecencyUploadsTileDto(query.docket,+overallResult[0].totalrecency);
    }
}
