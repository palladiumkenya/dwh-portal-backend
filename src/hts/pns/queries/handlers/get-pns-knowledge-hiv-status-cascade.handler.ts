import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsKnowledgeHivStatusCascadeQuery } from '../impl/get-pns-knowledge-hiv-status-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSKnowledgeHivStatus } from '../../entities/fact-pns-knowledge-hiv-status.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsKnowledgeHivStatusCascadeQuery)
export class GetPnsKnowledgeHivStatusCascadeHandler implements IQueryHandler<GetPnsKnowledgeHivStatusCascadeQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>
    ) {

    }

    async execute(query: GetPnsKnowledgeHivStatusCascadeQuery): Promise<any> {
        let pnsKnowledgeHivStatusCascade = `Select 
                SUM(q.ContactElicited) elicited, SUM(q.ContactTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive, SUM(q.NewNegatives) newNegatives, SUM(q.NewPositives) newPositives, SUM(q.UnknownStatus) unknownStatus
                FROM REPORTING.[dbo].[AggregateHTSPNSKnowledgeHIVStatus] q
                WHERE MFLCode IS NOT NULL`;
        // this.repository.createQueryBuilder('q')
        //     .select(['SUM(q.ContactElicited) elicited, SUM(q.ContactTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive, SUM(q.NewNegatives) newNegatives, SUM(q.NewPositives) newPositives, SUM(q.UnknownStatus) unknownStatus'])
        //     .where('q.Mflcode IS NOT NULL');

        if (query.county) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.agency) {
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and agencyName IN ('${query.agency
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if(query.project) {
        //     pnsKnowledgeHivStatusCascade.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     pnsKnowledgeHivStatusCascade.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsKnowledgeHivStatusCascade.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsKnowledgeHivStatusCascade = `${pnsKnowledgeHivStatusCascade} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        return await this.repository.query(
            pnsKnowledgeHivStatusCascade,
            [],
        );
    }
}
