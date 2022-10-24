import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsCascadeQuery } from '../impl/get-pns-sexual-contacts-cascade.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsSexualContactsCascadeQuery)
export class GetPnsSexualContactsCascadeHandler implements IQueryHandler<GetPnsSexualContactsCascadeQuery> {
    constructor(
        @InjectRepository(FactPNSSexualPartner)
        private readonly repository: Repository<FactPNSSexualPartner>
    ) {

    }

    async execute(query: GetPnsSexualContactsCascadeQuery): Promise<any> {
        const pnsSexualContactsCascade = this.repository.createQueryBuilder('q')
            .select(['SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
            .where('q.Mflcode IS NOT NULL');

        if(query.county) {
            pnsSexualContactsCascade.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsSexualContactsCascade.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsSexualContactsCascade.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsSexualContactsCascade.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if(query.month) {
        //     pnsSexualContactsCascade.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsCascade.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsCascade.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))>= :fromDate`,
                {
                    fromDate: query.fromDate,
                },
            );
        }

        if (query.toDate) {
            pnsSexualContactsCascade.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))<= :toDate`,
                {
                    toDate: query.toDate,
                },
            );
        }

        return await pnsSexualContactsCascade.getRawOne();
    }
}
