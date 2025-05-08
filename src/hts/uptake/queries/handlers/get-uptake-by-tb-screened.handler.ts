import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUptakeByTbScreenedQuery } from '../impl/get-uptake-by-tb-screened.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../entities/aggregate-hts-uptake.model';

@QueryHandler(GetUptakeByTbScreenedQuery)
export class GetUptakeByTbScreenedHandler
    implements IQueryHandler<GetUptakeByTbScreenedQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetUptakeByTbScreenedQuery): Promise<any> {
        const params = [];
        let uptakeByTBScreenedSql = `SELECT
                TBSCreening_grp,
                SUM(Tested)Tested, 
                SUM(Positive) Positive, 
                SUM(Linked) Linked
            FROM
                AggregateHTSTBscreening
            WHERE TBScreening IS NOT NULL`;

        if (query.county) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.subCounty) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and subcounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.facility) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`
        }

        if (query.partner) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.fromDate) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and year >= ${query.fromDate.substring(0, 4)}`;
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and month >= ${query.fromDate.substring(4)}`;
        }

        if (query.toDate) {
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and year <= ${query.toDate.substring(0, 4)}`;
            uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} and month <= ${query.toDate.substring(4)}`;
        }

        uptakeByTBScreenedSql = `${uptakeByTBScreenedSql} GROUP BY TBSCreening_grp`;

        return await this.repository.query(uptakeByTBScreenedSql, params);
    }
}
