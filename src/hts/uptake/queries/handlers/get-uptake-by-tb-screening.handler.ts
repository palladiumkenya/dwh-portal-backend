import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTbScreeningQuery } from '../impl/get-uptake-by-tb-screening.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeByTbScreeningQuery)
export class GetUptakeByTBScreeningHandler
    implements IQueryHandler<GetUptakeByTbScreeningQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeByTbScreeningQuery): Promise<any> {
        const params = [];
        let uptakeByClientTestedAsSql = `SELECT
                TBScreening tbScreeningOutcomes,
                SUM(Tested)Tested, 
                SUM(Positive) Positive, 
                ((CAST(SUM(CASE WHEN positive IS NULL THEN 0 ELSE positive END) AS FLOAT)/CAST(SUM(Tested) AS FLOAT))*100) AS positivity
            FROM
                AggregateHTSTBscreening
            WHERE TBScreening IS NOT NULL`;

        if (query.county) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and subcounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.fromDate) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and year >= ${query.fromDate.substring(0, 4)}`;
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and month >= ${query.fromDate.substring(4)}`;
        }

        if (query.toDate) {
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and year <= ${query.toDate.substring(0, 4)}`;
            uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} and month <= ${query.toDate.substring(4)}`;
        }

        uptakeByClientTestedAsSql = `${uptakeByClientTestedAsSql} GROUP BY TBScreening`;

        return await this.repository.query(uptakeByClientTestedAsSql, params);
    }
}
