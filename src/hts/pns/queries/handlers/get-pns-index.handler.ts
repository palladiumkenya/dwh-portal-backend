import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsIndexQuery } from '../impl/get-pns-index.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetPnsIndexQuery)
export class GetPnsIndexHandler implements IQueryHandler<GetPnsIndexQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetPnsIndexQuery): Promise<any> {
        let params = [];
        let pnsIndex = `SELECT 
                SUM(q.positive) indexClients
                FROM [dbo].[AggregateHTSUptake] q
                WHERE q.positive > 0`;

        if (query.county) {
            pnsIndex = `${pnsIndex}  and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsIndex = `${pnsIndex} and SubCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsIndex = `${pnsIndex} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsIndex = `${pnsIndex} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if(query.month) {
        //     pnsIndex.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsIndex.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsIndex = `${pnsIndex} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsIndex = `${pnsIndex} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        return await this.repository.query(pnsIndex, params);
    }
}
