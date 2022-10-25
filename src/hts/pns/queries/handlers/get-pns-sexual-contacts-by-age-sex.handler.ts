import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByAgeSexQuery } from '../impl/get-pns-sexual-contacts-by-age-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsSexualContactsByAgeSexQuery)
export class GetPnsSexualContactsByAgeSexHandler implements IQueryHandler<GetPnsSexualContactsByAgeSexQuery> {
    constructor(
        @InjectRepository(FactPNSSexualPartner)
        private readonly repository: Repository<FactPNSSexualPartner>
    ) {

    }

    async execute(query: GetPnsSexualContactsByAgeSexQuery): Promise<any> {
        const pnsSexualContactsByAgeSex = this.repository.createQueryBuilder('q')
            .select(['q.Agegroup age, q.Gender gender, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
            .where('q.Mflcode IS NOT NULL')
            .andWhere('q.Agegroup IS NOT NULL')
            .andWhere('q.Gender IS NOT NULL');

        if(query.county) {
            pnsSexualContactsByAgeSex.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsSexualContactsByAgeSex.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsSexualContactsByAgeSex.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsSexualContactsByAgeSex.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if(query.month) {
        //     pnsSexualContactsByAgeSex.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByAgeSex.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsByAgeSex.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))>= :fromDate`,
                {
                    fromDate: query.fromDate,
                },
            );
        }

        if (query.toDate) {
            pnsSexualContactsByAgeSex.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))<= :toDate`,
                {
                    toDate: query.toDate,
                },
            );
        }

        return await pnsSexualContactsByAgeSex
            .groupBy('q.Agegroup, q.Gender')
            .orderBy('q.Agegroup, q.Gender')
            .getRawMany();
    }
}
