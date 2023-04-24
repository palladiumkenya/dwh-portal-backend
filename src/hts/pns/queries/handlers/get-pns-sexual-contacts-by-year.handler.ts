import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByYearQuery } from '../impl/get-pns-sexual-contacts-by-year.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsSexualContactsByYearQuery)
export class GetPnsSexualContactsByYearHandler
    implements IQueryHandler<GetPnsSexualContactsByYearQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>,
    ) {}

    async execute(query: GetPnsSexualContactsByYearQuery): Promise<any> {
        let pnsSexualContactsByYear = `Select year,
                month,
                Sum(PartnersElicited) elicited,
                sum(PartnerTested) tested,
                Sum(Positive) positive,
                sum(Linked) linked,
                
                Sum(KnownPositive) knownPositive
            FROM [dbo].[AggregateHTSPNSSexualPartner]
            where MFLCode is not null
            `;

        // this.repository.createQueryBuilder('q')
        //     .select(['q.year, q.month, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.year IS NOT NULL')
        //     .andWhere('q.month IS NOT NULL');

        if (query.county) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByYear = `${pnsSexualContactsByYear} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsSexualContactsByYear.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByYear.andWhere('q.year = :year', { year: query.year});
        // }
        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsSexualContactsByYear = `${pnsSexualContactsByYear} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        pnsSexualContactsByYear = `${pnsSexualContactsByYear} GROUP BY year, month`;

        pnsSexualContactsByYear = `${pnsSexualContactsByYear} ORDER BY year, month`;

        return await this.repository.query(pnsSexualContactsByYear, []);
    }
}
