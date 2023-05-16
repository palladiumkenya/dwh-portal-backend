import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByCountyQuery } from '../impl/get-pns-sexual-contacts-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';
import { FactHTSClientTests } from './../../../linkage/entities/fact-hts-client-tests.model';

@QueryHandler(GetPnsSexualContactsByCountyQuery)
export class GetPnsSexualContactsByCountyHandler implements IQueryHandler<GetPnsSexualContactsByCountyQuery> {
    constructor(
        @InjectRepository(FactHTSClientTests, 'mssql')
        private readonly repository: Repository<FactHTSClientTests>
    ) {

    }

    async execute(query: GetPnsSexualContactsByCountyQuery): Promise<any> {
        let pnsSexualContactsByCounty = `Select County county,
                Sum(PartnersElicited) elicited,
                sum(PartnerTested) tested,
                Sum(Positive) positive,
                sum(Linked) linked,
                
                Sum(KnownPositive) knownPositive
            FROM [dbo].[AggregateHTSPNSSexualPartner]
            where MFLCode is not null
            `;
        
        // this.repository.createQueryBuilder('q')
        //     .select(['q.County county, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.County IS NOT NULL');

        
        if (query.county) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.project) {
        //     pnsSexualContactsByCounty.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        // if(query.month) {
        //     pnsSexualContactsByCounty.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByCounty.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} GROUP BY County`;

        pnsSexualContactsByCounty = `${pnsSexualContactsByCounty} ORDER BY SUM(PartnerTested) Desc`;

        return await this.repository.query(pnsSexualContactsByCounty, []);
    }
}
