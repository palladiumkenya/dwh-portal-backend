import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { FactTransVLOverallUptake } from '../../entities/fact-trans-vl-overall-uptake.model';
import { GetVlSuppressionByPartnerQuery } from '../impl/get-vl-suppression-by-partner.query';

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

        if (query.agency) {
            vlSuppressionByPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByPartner.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionByPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByPartner
            .groupBy('f.CTPartner')
            .orderBy('SUM(f.VirallySuppressed)', 'DESC')
            .getRawMany();
    }
}
