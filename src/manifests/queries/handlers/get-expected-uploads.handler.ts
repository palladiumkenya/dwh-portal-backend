import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetExpectedUploadsQuery } from '../impl/get-expected-uploads.query';
import { ExpectedUploadsTileDto } from '../../entities/dtos/expected-uploads-tile.dto';


@QueryHandler(GetExpectedUploadsQuery)
export class GetExpectedUploadsHandler
    implements IQueryHandler<GetExpectedUploadsQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(
        query: GetExpectedUploadsQuery,
    ): Promise<ExpectedUploadsTileDto> {
        const params = [];
        params.push(query.docket);
        let expectedSql = `select sum(expected) as totalexpected from AggregateExpectedUploads where docket='${query.docket}'`;
        if (query.county) {
            expectedSql = `${expectedSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.subCounty) {
            expectedSql = `${expectedSql} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.agency) {
            expectedSql = `${expectedSql} and agency IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.partner) {
            expectedSql = `${expectedSql} and Partner IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`
        }
        const expectedResult = await this.repository.query(expectedSql, params);
        return new ExpectedUploadsTileDto(
            query.docket,
            +expectedResult[0].totalexpected,
        );
    }
}
