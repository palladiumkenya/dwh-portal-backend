import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../../../entities/care_treatment/fact-trans-vl-overall-uptake.model';
import { GetVlSuppressionByPartnerQuery } from '../get-vl-suppression-by-partner.query';

@QueryHandler(GetVlSuppressionByPartnerQuery)
export class GetVlSuppressionByPartnerHandler implements IQueryHandler<GetVlSuppressionByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransVLOverallUptake, 'mssql')
        private readonly repository: Repository<FactTransVLOverallUptake>
    ) {
    }

    async execute(query: GetVlSuppressionByPartnerQuery): Promise<any> {
        const vlSuppressionByPartner = this.repository.createQueryBuilder('f')
            .select(['f.CTPartner partner, SUM(f.VirallySuppressed) suppressed'])
            .where('f.MFLCode > 0')
            .andWhere('f.CTPartner IS NOT NULL');

        if (query.county) {
            vlSuppressionByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionByPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlSuppressionByPartner
            .groupBy('f.CTPartner')
            .orderBy('SUM(f.VirallySuppressed)')
            .getRawMany();
    }
}
