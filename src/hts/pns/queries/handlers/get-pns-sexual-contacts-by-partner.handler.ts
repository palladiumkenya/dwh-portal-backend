import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByPartnerQuery } from '../impl/get-pns-sexual-contacts-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsSexualContactsByPartnerQuery)
export class GetPnsSexualContactsByPartnerHandler implements IQueryHandler<GetPnsSexualContactsByPartnerQuery> {
    constructor(
        @InjectRepository(FactPNSSexualPartner)
        private readonly repository: Repository<FactPNSSexualPartner>
    ) {

    }

    async execute(query: GetPnsSexualContactsByPartnerQuery): Promise<any> {
        const pnsSexualContactsByPartner = this.repository.createQueryBuilder('q')
            .select(['q.CTPartner partner, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
            .where('q.Mflcode IS NOT NULL')
            .andWhere('q.CTPartner IS NOT NULL');

        if(query.county) {
            pnsSexualContactsByPartner.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsSexualContactsByPartner.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsSexualContactsByPartner.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsSexualContactsByPartner.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if(query.month) {
        //     pnsSexualContactsByPartner.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByPartner.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsByPartner.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))>= :fromDate`,
                {
                    fromDate: query.fromDate,
                },
            );
        }

        if (query.toDate) {
            pnsSexualContactsByPartner.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))<= :toDate`,
                {
                    toDate: query.toDate,
                },
            );
        }

        return await pnsSexualContactsByPartner
            .groupBy('q.CTPartner')
            .orderBy('SUM(q.PartnerTested)', 'DESC')
            .getRawMany();
    }
}
