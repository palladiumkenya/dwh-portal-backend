import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsCascadeQuery } from '../impl/get-pns-sexual-contacts-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetPnsSexualContactsCascadeQuery)
export class GetPnsSexualContactsCascadeHandler implements IQueryHandler<GetPnsSexualContactsCascadeQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>
    ) {

    }

    async execute(query: GetPnsSexualContactsCascadeQuery): Promise<any> {
        let pnsSexualContactsCascade = `Select 
                Sum(PartnersElicited) elicited,
                sum(PartnerTested) tested,
                Sum(Positive) positive,
                sum(Linked) linked,
                
                Sum(KnownPositive) knownPositive
            FROM [dbo].[AggregateHTSPNSSexualPartner]
            where MFLCode is not null
        `;
        // this.repository.createQueryBuilder('q')
        //     .select(['SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL');

        if (query.county) {
            pnsSexualContactsCascade = `${pnsSexualContactsCascade} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsCascade = `${pnsSexualContactsCascade} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsCascade = `${pnsSexualContactsCascade} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsCascade = `${pnsSexualContactsCascade} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsCascade = `${pnsSexualContactsCascade} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsSexualContactsCascade.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsCascade.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsSexualContactsCascade = `${pnsSexualContactsCascade} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsSexualContactsCascade = `${pnsSexualContactsCascade} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        return await this.repository.query(pnsSexualContactsCascade, []);
    }
}
