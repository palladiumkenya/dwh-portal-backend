import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByAgeSexQuery } from '../impl/get-pns-sexual-contacts-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregateHTSUptake } from '../../../uptake/entities/aggregate-hts-uptake.model';

@QueryHandler(GetPnsSexualContactsByAgeSexQuery)
export class GetPnsSexualContactsByAgeSexHandler implements IQueryHandler<GetPnsSexualContactsByAgeSexQuery> {
    constructor(
        @InjectRepository(AggregateHTSUptake, 'mssql')
        private readonly repository: Repository<AggregateHTSUptake>
    ) {

    }

    async execute(query: GetPnsSexualContactsByAgeSexQuery): Promise<any> {
        let pnsSexualContactsByAgeSex = `Select Agegroup age,
                Gender gender,
                Sum(PartnersElicited) elicited,
                sum(PartnerTested) tested,
                Sum(Positive) positive,
                sum(Linked) linked,
                
                Sum(KnownPositive) knownPositive
            FROM [dbo].[AggregateHTSPNSSexualPartner]
            where MFLCode is not null
            `;

        // this.repository.createQueryBuilder('q')
        //     .select(['q.Agegroup age, q.Gender gender, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
        //     .where('q.Mflcode IS NOT NULL')
        //     .andWhere('q.Agegroup IS NOT NULL')
        //     .andWhere('q.Gender IS NOT NULL');

        if (query.county) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and County IN ('${query.county
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.subCounty) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and subCounty IN ('${query.subCounty
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.facility) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and FacilityName IN ('${query.facility
                .toString()
                .replace(/,/g, "','")}')`;
        }

        if (query.partner) {
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and PartnerName IN ('${query.partner
                .toString()
                .replace(/,/g, "','")}')`;
        }

        // if (query.agency) {
        //     pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and agencyName IN ('${query.agency
        //         .toString()
        //         .replace(/,/g, "','")}')`;
        // }

        // if(query.month) {
        //     pnsSexualContactsByAgeSex.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByAgeSex.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            const fromYear = parseInt(query.fromDate.substring(0, 4));
            const fromMonth = parseInt(query.fromDate.substring(4));
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and (year > ${fromYear} or (year = ${fromYear} and month >= ${fromMonth}))`;
        }

        if (query.toDate) {
            const toYear = parseInt(query.toDate.substring(0, 4));
            const toMonth = parseInt(query.toDate.substring(4));
            pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} and (year < ${toYear} or (year = ${toYear} and month <= ${toMonth}))`;
        }

        pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} GROUP BY Gender,Agegroup`;

        pnsSexualContactsByAgeSex = `${pnsSexualContactsByAgeSex} ORDER BY Agegroup, Gender`;


        return await this.repository.query(
            pnsSexualContactsByAgeSex,
            [],
        )
    }
}
