import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPnsSexualContactsByYearQuery } from '../impl/get-pns-sexual-contacts-by-year.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactPNSSexualPartner } from '../../entities/fact-pns-sexual-partner.entity';
import { Repository } from 'typeorm';

@QueryHandler(GetPnsSexualContactsByYearQuery)
export class GetPnsSexualContactsByYearHandler implements IQueryHandler<GetPnsSexualContactsByYearQuery> {
    constructor(
        @InjectRepository(FactPNSSexualPartner)
        private readonly repository: Repository<FactPNSSexualPartner>
    ) {

    }

    async execute(query: GetPnsSexualContactsByYearQuery): Promise<any> {
        const pnsSexualContactsByYear = this.repository.createQueryBuilder('q')
            .select(['q.year, q.month, SUM(q.PartnersElicited) elicited, SUM(q.PartnerTested) tested, SUM(q.Positive) positive, SUM(q.Linked) linked, SUM(q.KnownPositive) knownPositive'])
            .where('q.Mflcode IS NOT NULL')
            .andWhere('q.year IS NOT NULL')
            .andWhere('q.month IS NOT NULL');

        if(query.county) {
            pnsSexualContactsByYear.andWhere('q.County IN (:...counties)', { counties: query.county });
        }

        if(query.subCounty) {
            pnsSexualContactsByYear.andWhere('q.SubCounty IN (:...subCounties)', { subCounties: query.county });
        }

        if(query.facility) {
            pnsSexualContactsByYear.andWhere('q.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if(query.partner) {
            pnsSexualContactsByYear.andWhere('q.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if(query.month) {
            pnsSexualContactsByYear.andWhere('q.month = :month', { month: query.month });
        }

        if(query.year) {
            pnsSexualContactsByYear.andWhere('q.year = :year', { year: query.year});
        }

        return await pnsSexualContactsByYear
            .groupBy('q.year, q.month')
            .orderBy('q.year, q.month')
            .getRawMany();
    }
}
