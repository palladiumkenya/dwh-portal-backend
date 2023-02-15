import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { GetExpectedUploadsPartnerCountyQuery } from '../impl/get-expected-uploads-partner-county.query';

@QueryHandler(GetExpectedUploadsPartnerCountyQuery)
export class GetExpectedUploadsPartnerCountyHandler
    implements IQueryHandler<GetExpectedUploadsPartnerCountyQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(query: GetExpectedUploadsPartnerCountyQuery): Promise<any> {
        const params = [];
        params.push(query.docket);
        let expectedPartnerCountySql = `select sum(expected) AS totalexpected, ${query.reportingType} from AggregateExpectedUploads where docket='${query.docket}'`;
        if (query.county) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and county IN (?)`;
            params.push(query.county);
        }
        if (query.subCounty) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }
        if (query.agency) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and agency IN (?)`;
            params.push(query.agency);
        }
        if (query.partner) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and partner IN (?)`;
            params.push(query.partner);
        }

        expectedPartnerCountySql = `${expectedPartnerCountySql} GROUP BY ${query.reportingType} ORDER BY sum(expected) DESC`;
        return await this.repository.query(expectedPartnerCountySql, params);
    }
}
