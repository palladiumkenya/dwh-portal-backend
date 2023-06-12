import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsChildrenByYearQuery } from '../impl/get-pns-children-by-year.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSChildren } from '../../entities/fact-pns-children.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsChildrenByYearQuery)
export class GetPnsChildrenByYearHandler
    implements IQueryHandler<GetPnsChildrenByYearQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsChildrenByYearQuery): Promise<any> {
        let pnsChildrenByYear = `Select year,
                month,
                Sum(ChildrenElicited) elicited,
                sum(ChildrenTested) tested,
                Sum(ChildrenPositive) positive,
                sum(ChildrenLiked) linked,
                
                Sum(ChildrenKnownPositive) knownPositive
            From REPORTING.dbo.AggregateHTSPNSChildren pns

            where MFLCode is not null
            `;
        // this.repository.createQueryBuilder('q')
        //     .select(['q.year, q.month, SUM(q.ChildrenElicited) elicited, SUM(q.ChildTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.year IS NOT NULL')
        //     .andWhere('q.month IS NOT NULL');

        if (query.county) {
            pnsChildrenByYear = `${pnsChildrenByYear} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsChildrenByYear = `${pnsChildrenByYear} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsChildrenByYear = `${pnsChildrenByYear} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsChildrenByYear = `${pnsChildrenByYear} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsChildrenByYear = `${pnsChildrenByYear} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsChildrenByYear.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsChildrenByYear.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsChildrenByYear = `${pnsChildrenByYear} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsChildrenByYear = `${pnsChildrenByYear} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        pnsChildrenByYear = `${pnsChildrenByYear} GROUP BY year, month`;

        pnsChildrenByYear = `${pnsChildrenByYear} ORDER BY year, month`;

        return await this.repository.query(pnsChildrenByYear, []);
        // return await pnsChildrenByYear
        //     .groupBy('q.year, q.month')
        //     .orderBy('q.year, q.month')
        //     .getRawMany();
    }
}
