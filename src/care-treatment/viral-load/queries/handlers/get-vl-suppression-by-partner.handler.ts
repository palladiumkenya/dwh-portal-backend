import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlSuppressionByPartnerQuery } from '../impl/get-vl-suppression-by-partner.query';
import { AggregateVLUptakeOutcome } from '../../entities/aggregate-vl-uptake-outcome.model';

@QueryHandler(GetVlSuppressionByPartnerQuery)
export class GetVlSuppressionByPartnerHandler implements IQueryHandler<GetVlSuppressionByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateVLUptakeOutcome, 'mssql')
        private readonly repository: Repository<AggregateVLUptakeOutcome>
    ) {
    }

    async execute(query: GetVlSuppressionByPartnerQuery): Promise<any> {
        const vlSuppressionByPartner = this.repository.createQueryBuilder('f')
            .select(['f.PartnerName partner, SUM(f.VirallySuppressed) suppressed'])
            .where('f.MFLCode > 0')
            .andWhere('f.PartnerName IS NOT NULL');

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
            vlSuppressionByPartner.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionByPartner.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByPartner.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionByPartner.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionByPartner
            .groupBy('f.PartnerName')
            .orderBy('SUM(f.VirallySuppressed)', 'DESC')
            .getRawMany();
    }
}
