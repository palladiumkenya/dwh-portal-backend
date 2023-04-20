import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsChildrenCascadeQuery } from '../impl/get-pns-children-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSChildren } from '../../entities/fact-pns-children.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsChildrenCascadeQuery)
export class GetPnsChildrenCascadeHandler
    implements IQueryHandler<GetPnsChildrenCascadeQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsChildrenCascadeQuery): Promise<any> {
        let pnsChildrenCascade = `Select 
                Sum(ChildrenElicited) elicited,
                sum(ChildrenTested) tested,
                Sum(ChildrenPositive) positive,
                sum(ChildrenLiked) linked,
                
                Sum(ChildrenKnownPositive) knownPositive
            From REPORTING.dbo.AggregateHTSPNSChildren pns

            where MFLCode is not null
        `;

        // this.repository.createQueryBuilder('q')
        //     .select(['SUM(q.ChildrenElicited) elicited, SUM(q.ChildTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL');

        if (query.county) {
            pnsChildrenCascade = `${pnsChildrenCascade} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) { 
            pnsChildrenCascade = `${pnsChildrenCascade} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsChildrenCascade = `${pnsChildrenCascade} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsChildrenCascade = `${pnsChildrenCascade} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsChildrenCascade = `${pnsChildrenCascade} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsChildrenCascade.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsChildrenCascade.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const year = parseInt(query.fromDate.substring(0, 4));
            const month = parseInt(query.fromDate.substring(4));
            pnsChildrenCascade = `${pnsChildrenCascade} and year >= ${year}`;
            pnsChildrenCascade = `${pnsChildrenCascade} and month >= ${month}`;
        }

        if (query.toDate) {
            const year = parseInt(query.toDate.substring(0, 4));
            const month = parseInt(query.toDate.substring(4));
            pnsChildrenCascade = `${pnsChildrenCascade} and year <= ${year}`;
            pnsChildrenCascade = `${pnsChildrenCascade} and month <= ${month}`;
        }
        return await this.repository.query(pnsChildrenCascade, []);

        // return await pnsChildrenCascade.getRawOne();
    }
}
