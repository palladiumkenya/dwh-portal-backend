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
        let emrDistributionSql = `SELECT ${query.reportingType}, COUNT(fc.facilityId) AS facilities_count 
            FROM(SELECT DISTINCT fm.facilityId, fm.timeId FROM fact_manifest fm WHERE fm.docketId = ?) fc 
            INNER JOIN dim_facility  df ON df.facilityId = fc.facilityId
            INNER JOIN dim_time dt ON dt.timeId = fc.timeId`;

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

        if(query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            emrDistributionSql = `${emrDistributionSql} and year=? and month=?`;
            params.push(year);
            params.push(month);
        }

        emrDistributionSql = `${emrDistributionSql} GROUP BY ${query.reportingType} ORDER BY ${query.reportingType}`;

        const overallResult = await this.repository.query(emrDistributionSql, params);
        return overallResult;
    }
}
