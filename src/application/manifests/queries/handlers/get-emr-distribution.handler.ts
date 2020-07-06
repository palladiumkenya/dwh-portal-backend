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
        console.log(query);
        let emrDistributionSql = `SELECT ${query.reportingType}, COUNT(fc.facilityId) AS facilities_count 
            FROM(SELECT DISTINCT fm.facilityId FROM fact_manifest fm WHERE fm.docketId = ?) fc 
            INNER JOIN dim_facility  df ON df.facilityId = fc.facilityId
            GROUP BY ${query.reportingType}
            ORDER BY ${query.reportingType}`;

        if (query.county) {
            emrDistributionSql = `${emrDistributionSql} and county=?`;
            params.push(query.county);
        }

        const overallResult = await this.repository.query(emrDistributionSql, params);
        return overallResult;
    }
}
