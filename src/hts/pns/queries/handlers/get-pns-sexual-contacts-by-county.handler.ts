import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByCountyQuery } from '../impl/get-pns-sexual-contacts-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsSexualContactsByCountyQuery)
export class GetPnsSexualContactsByCountyHandler implements IQueryHandler<GetPnsSexualContactsByCountyQuery> {
    constructor(
        @InjectRepository(FactPNSSexualPartner)
        private readonly repository: Repository<FactPNSSexualPartner>
    ) {

    }

    async execute(query: GetPnsSexualContactsByCountyQuery): Promise<any> {
        const pnsSexualContactsByCounty = this.repository.createQueryBuilder('q')
            .select(['q.County county, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
            .where('q.Mflcode IS NOT NULL')
            .andWhere('q.County IS NOT NULL');

        if(query.county) {
            pnsSexualContactsByCounty.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if(query.subCounty) {
            pnsSexualContactsByCounty.andWhere('q.SubCounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if(query.facility) {
            pnsSexualContactsByCounty.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if(query.partner) {
            pnsSexualContactsByCounty.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if(query.month) {
        //     pnsSexualContactsByCounty.andWhere('q.month = :month', { month: query.month });
        // }

        // if(query.year) {
        //     pnsSexualContactsByCounty.andWhere('q.year = :year', { year: query.year});
        // }

        if (query.fromDate) {
            pnsSexualContactsByCounty.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))>= :fromDate`,
                {
                    fromDate: query.fromDate,
                },
            );
        }

        if (query.toDate) {
            pnsSexualContactsByCounty.andWhere(
                `CONCAT(year, LPAD(month, 2, '0'))<= :toDate`,
                {
                    toDate: query.toDate,
                },
            );
        }

        return await pnsSexualContactsByCounty
            .groupBy('q.County')
            .orderBy('SUM(q.PartnerTested)', 'DESC')
            .getRawMany();
    }
}
