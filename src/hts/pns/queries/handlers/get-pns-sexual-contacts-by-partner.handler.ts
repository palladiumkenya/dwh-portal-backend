import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByPartnerQuery } from '../impl/get-pns-sexual-contacts-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetPnsSexualContactsByPartnerQuery)
export class GetPnsSexualContactsByPartnerHandler
    implements IQueryHandler<GetPnsSexualContactsByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>,
    ) {}

    async execute(query: GetPnsSexualContactsByPartnerQuery): Promise<any> {
        let pnsSexualContactsByPartner = `Select PartnerName partner,
                Sum(PartnersElicited) elicited,
                sum(PartnerTested) tested,
                Sum(Positive) positive,
                sum(Linked) linked,
                
                Sum(KnownPositive) knownPositive
            FROM [dbo].[AggregateHTSPNSSexualPartner]
            where MFLCode is not null
            `;
        // this.repository.createQueryBuilder('q')
        //     .select(['q.CTPartner partner, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.CTPartner IS NOT NULL');

        if (query.county) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsSexualContactsByPartner.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByPartner.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} GROUP BY PartnerName`;

        pnsSexualContactsByPartner = `${pnsSexualContactsByPartner} ORDER BY SUM(PartnerTested) DESC`;

        return await this.repository.query(pnsSexualContactsByPartner, []);

        // return await pnsSexualContactsByPartner
        //     .groupBy('q.CTPartner')
        //     .orderBy('SUM(q.PartnerTested)', 'DESC')
        //     .getRawMany();
    }
}
