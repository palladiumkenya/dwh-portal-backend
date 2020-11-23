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
            pnsSexualContactsCascade.andWhere('q.County IN (:...counties)', { counties: query.county });
        }

        if(query.subCounty) {
            pnsSexualContactsCascade.andWhere('q.SubCounty IN (:...subCounties)', { subCounties: query.county });
        }

        if(query.facility) {
            pnsSexualContactsCascade.andWhere('q.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.partner) {
            pnsSexualContactsCascade.andWhere('q.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if(query.month) {
            pnsSexualContactsCascade.andWhere('q.month = :month', { month: query.month });
        }

        if(query.year) {
            pnsSexualContactsCascade.andWhere('q.year = :year', { year: query.year});
        }

        return await pnsSexualContactsCascade.getRawOne();
    }
}
