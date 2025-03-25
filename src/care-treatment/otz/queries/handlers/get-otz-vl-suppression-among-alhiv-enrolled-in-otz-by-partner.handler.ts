import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzByPartnerQuery } from '../impl/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivEnrolledInOtzByPartnerQuery)
export class GetOtzVlSuppressionAmongAlhivEnrolledInOtzByPartnerHandler implements IQueryHandler<GetOtzVlSuppressionAmongAlhivEnrolledInOtzByPartnerQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }

    async execute(query: GetOtzVlSuppressionAmongAlhivEnrolledInOtzByPartnerQuery): Promise<any> {
        const vlSuppressionOtzByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                '[PartnerName] CTPartner, ValidVLResultCategory Last12MVLResult, SUM([HasValidVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND ValidVLResultCategory IS NOT NULL',
            );

        if (query.county) {
            vlSuppressionOtzByPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionOtzByPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionOtzByPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionOtzByPartner.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionOtzByPartner.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzByPartner.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionOtzByPartner.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionOtzByPartner
            .groupBy('[PartnerName], ValidVLResultCategory')
            .orderBy('[PartnerName]')
            .getRawMany();
    }
}
