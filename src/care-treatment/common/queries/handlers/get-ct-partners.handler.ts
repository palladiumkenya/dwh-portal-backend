import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtPartnersQuery } from '../impl/get-ct-partners.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../entities/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtPartnersQuery)
export class GetCtPartnersHandler implements IQueryHandler<GetCtPartnersQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {

    }

    async execute(query: GetCtPartnersQuery): Promise<any> {
        const partners = this.repository.createQueryBuilder('q')
            .select(['distinct CTPartner partner'])
            .where('q.CTPartner IS NOT NULL');

        if (query.county) {
            partners.andWhere('q.County IN (:...county)', { county: query.county });
        }

        if (query.subCounty) {
            partners.andWhere('q.Subcounty IN (:...subCounty)', { subCounty: query.subCounty });
        }

        if (query.facility) {
            partners.andWhere('q.FacilityName IN (:...facility)', { facility: query.facility });
        }

        if (query.partner) {
            partners.andWhere('q.CTPartner IN (:...partner)', { partner: query.partner });
        }

        // if (query.agency) {
        //     partners.andWhere('q.agency IN (:...agency)', { agency: query.agency });
        // }

        // if (query.project) {
        //     partners.andWhere('q.project IN (:...project)', { project: query.project });
        // }

        return await partners.orderBy('q.CTPartner').getRawMany();
    }
}
