import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FactManifest } from '../../entities/fact-manifest.entity';
import { GetTrendsConsistencyQuery } from '../impl/get-trends-consistency.query';
import { ConsistencyUploadsDto } from '../../entities/dtos/consistency-uploads.dto';
import moment = require('moment');

@QueryHandler(GetTrendsConsistencyQuery)
export class GetTrendsConsistencyHandler
    implements IQueryHandler<GetTrendsConsistencyQuery> {
    constructor(
        @InjectRepository(FactManifest, 'mssql')
        private readonly repository: Repository<FactManifest>,
    ) {}

    async execute(
        query: GetTrendsConsistencyQuery,
    ): Promise<ConsistencyUploadsDto> {
        let consistencyResult;
        let startDate;
        let endDate;
        if (query.endDate) {
            endDate = moment(query.endDate, 'YYYY-MM-DD');
        }
        if (query.startDate) {
            startDate = moment(query.startDate, 'YYYY-MM-DD');
        }
        consistencyResult = [];
        let numberOfMonths = Math.ceil(endDate.diff(startDate, 'months', true));
        for (let i = 0; i < numberOfMonths; i++) {
            let queryDate = startDate
                .clone()
                .add(i, 'month')
                .format('YYYY-MM-DD');
            let params = [];
            const consistencySql = `EXEC generate_consistency_uploads @PERIOD = '${queryDate}' , @docketName ='${query.docket}'`;
            const results = await this.repository.query(consistencySql, params);
            if (results) {
                consistencyResult = consistencyResult.concat(results);
            }
        }
        if (consistencyResult.length > 0) {
            if (query.county) {
                consistencyResult = consistencyResult.filter(
                    x => query.county.indexOf(x.county) !== -1,
                );
            }
            if (query.subCounty) {
                consistencyResult = consistencyResult.filter(
                    x => query.subCounty.indexOf(x.subCounty) !== -1,
                );
            }
            // if (query.facility) {
            //     consistencyResult = consistencyResult.filter(x => query.facility.indexOf(x.facility) !== -1);
            // }
            if (query.partner) {
                consistencyResult = consistencyResult.filter(
                    x => query.partner.indexOf(x.partner) !== -1,
                );
            }
            if (query.agency) {
                consistencyResult = consistencyResult.filter(
                    x => query.agency.indexOf(x.agency) !== -1,
                );
            }
        }
        return consistencyResult;
    }
}
