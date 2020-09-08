import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCtPartnersQuery } from '../get-ct-partners.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransHmisStatsTxcurr } from '../../../../entities/care_treatment/fact-trans-hmis-stats-txcurr.model';
import { Repository } from 'typeorm';

@QueryHandler(GetCtPartnersQuery)
export class GetCtPartnersHandler implements IQueryHandler<GetCtPartnersQuery> {
    constructor(
        @InjectRepository(FactTransHmisStatsTxcurr, 'mssql')
        private readonly repository: Repository<FactTransHmisStatsTxcurr>
    ) {
    }

    async execute(query: GetCtPartnersQuery): Promise<any> {
        const partners = this.repository.createQueryBuilder('f')
            .select(['distinct [CTPartner] partner'])
            .where('f.[CTPartner] IS NOT NULL');

        if (query.county) {
            partners
                .andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            partners
                .andWhere('f.Subcounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            partners
                .andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        return await partners
            .orderBy('f.CTPartner')
            .getRawMany();
    }
}
