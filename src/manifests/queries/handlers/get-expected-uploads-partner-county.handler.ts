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
        const escapeQuotes = (str) => str.replace(/'/g, "''");
        params.push(query.docket);
        let expectedPartnerCountySql = `select sum(expected) AS totalexpected, ${query.reportingType} from AggregateExpectedUploads where docket='${query.docket}'`;
        if (query.county) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and County IN ('${query.county
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.subCounty) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and subCounty IN ('${query.subCounty
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.agency) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and agency IN ('${query.agency
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }
        if (query.partner) {
            expectedPartnerCountySql = `${expectedPartnerCountySql} and Partner IN ('${query.partner
                .map(escapeQuotes)
                .toString()
                .replace(/,/g, "','")}')`
        }

        expectedPartnerCountySql = `${expectedPartnerCountySql} GROUP BY ${query.reportingType} ORDER BY sum(expected) DESC`;
        return await this.repository.query(expectedPartnerCountySql, params);
    }
}
