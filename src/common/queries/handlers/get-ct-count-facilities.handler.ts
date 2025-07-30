import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtCountFacilitiesQuery } from '../impl/get-ct-count-facilities.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../../manifests/entities/fact-manifest.entity';
import { UploadsSummaryDto } from '../../../manifests/entities/dtos/uploads-summary.dto';

@QueryHandler(GetCtCountFacilitiesQuery)
export class GetCtCountFacilitiesHandler implements IQueryHandler<GetCtCountFacilitiesQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>
    ) {

    }

    async execute(query: GetCtCountFacilitiesQuery): Promise<any> {
        const params = [];
        const docket = query.docket;
        let baseWhere = `where docket='${docket}'`;

        if (query.period) {
            const year = query.period.split(',')[0];
            const month = query.period.split(',')[1];
            baseWhere += ` and year=${year} and month=${month}`;
            params.push(year);
            params.push(month);
        }

        // Facilities
        const facilitiesSql = `select sum(recency) as totalFacilities from AggregateRecencyUploads ${baseWhere}`;
        const facilitiesResult = await this.repository.query(facilitiesSql, params);

        // Partners
        const partnersSql = `select count(distinct partner) as totalPartners from AggregateRecencyUploads ${baseWhere}`;
        const partnersResult = await this.repository.query(partnersSql, params);

        // Counties
        const countiesSql = `select count(distinct county) as totalCounties from AggregateRecencyUploads ${baseWhere}`;
        const countiesResult = await this.repository.query(countiesSql, params);

        return new UploadsSummaryDto(
            docket,
            +facilitiesResult[0].totalFacilities || 0,
            +partnersResult[0].totalPartners || 0,
            +countiesResult[0].totalCounties || 0
        );
    }
}
