import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEmrDistributionQuery } from '../get-emr-distribution.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../../../entities/manifests/fact-manifest.entity';
import { Repository } from 'typeorm';
import { EmrDistributionDto } from '../../../../entities/manifests/dtos/emr-distribution.dto';

@QueryHandler(GetEmrDistributionQuery)
export class GetEmrDistributionHandler implements IQueryHandler<GetEmrDistributionQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>) {
    }

    async execute(query: GetEmrDistributionQuery): Promise<EmrDistributionDto> {
        const params = [query.docket];
        let emrDistributionSql = `SELECT SUM(expected) as facilities_count, ${query.reportingType} FROM \`expected_uploads\` WHERE docket = ?`;

        if(query.county) {
            emrDistributionSql = `${emrDistributionSql} and county=?`;
            params.push(query.county);
        }

        if(query.agency) {
            emrDistributionSql = `${emrDistributionSql} and agency=?`;
            params.push(query.agency);
        }

        if(query.partner) {
            emrDistributionSql = `${emrDistributionSql} and partner=?`;
            params.push(query.partner);
        }

        emrDistributionSql = `${emrDistributionSql} GROUP BY ${query.reportingType} ORDER BY facilities_count ASC`;

        const overallResult = await this.repository.query(emrDistributionSql, params);
        return overallResult;
    }
}
