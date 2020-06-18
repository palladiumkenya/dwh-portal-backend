import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { GetOverallUploadsQuery } from '../get-overall-uploads.query';
import { OverallUploadsTileDto } from '../../../../entities/manifests/dtos/overall-uploads-tile.dto';


@QueryHandler(GetOverallUploadsQuery)
export class GetOverallUploadsHandler implements IQueryHandler<GetOverallUploadsQuery> {

    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>,
    ) {
    }

    async execute(query: GetOverallUploadsQuery): Promise<OverallUploadsTileDto> {
        const params = [query.docket];
        let overallSql = 'select sum(uploads) as totaloverall from overall_uploads where docket=?';
        if (query.county) {
            overallSql = `${overallSql} and county=?`;
            params.push(query.county);
        }
        if (query.agency) {
            overallSql = `${overallSql} and agency=?`;
            params.push(query.agency);
        }
        if (query.partner) {
            overallSql = `${overallSql} and partner=?`;
            params.push(query.partner);
        }
        if (query.period) {
            const year=query.period.split(',')[0];
            const month=query.period.split(',')[1];
            overallSql = `${overallSql} and year=? and month=?`;
            params.push(year);
            params.push(month);
        }
        const overallResult = await this.repository.query(overallSql, params);
        return new OverallUploadsTileDto(query.docket,+overallResult[0].totaloverall);
    }
}
