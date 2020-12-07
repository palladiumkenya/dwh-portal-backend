import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetEmrDistributionQuery } from '../impl/get-emr-distribution.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { Repository } from 'typeorm';
import { EmrDistributionDto } from '../../entities/dtos/emr-distribution.dto';

@QueryHandler(GetEmrDistributionQuery)
export class GetEmrDistributionHandler implements IQueryHandler<GetEmrDistributionQuery> {
    constructor(
        @InjectRepository(FactManifest)
        private readonly repository: Repository<FactManifest>
    ) {}

    async execute(query: GetEmrDistributionQuery): Promise<EmrDistributionDto> {
        const params = [];
        params.push(query.docket);
        let emrDistributionSql = `SELECT SUM(expected) as facilities_count, ${query.reportingType} FROM \`expected_uploads\` WHERE docket = ?`;
        if(query.county) {
            emrDistributionSql = `${emrDistributionSql} and county IN (?)`;
            params.push(query.county);
        }
        if(query.subCounty) {
            emrDistributionSql = `${emrDistributionSql} and subCounty IN (?)`;
            params.push(query.subCounty);
        }
        // if(query.facility) {
        //     emrDistributionSql = `${emrDistributionSql} and facility IN (?)`;
        //     params.push(query.facility);
        // }
        if(query.partner) {
            emrDistributionSql = `${emrDistributionSql} and partner IN (?)`;
            params.push(query.partner);
        }
        if(query.agency) {
            emrDistributionSql = `${emrDistributionSql} and agency IN (?)`;
            params.push(query.agency);
        }
        emrDistributionSql = `${emrDistributionSql} GROUP BY ${query.reportingType} ORDER BY facilities_count DESC`;
        return await this.repository.query(emrDistributionSql, params);
    }
}
