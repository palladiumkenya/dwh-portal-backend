import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzByAgeQuery } from '../impl/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from '../../entities/line-list-otz.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivEnrolledInOtzByAgeQuery)
export class GetOtzVlSuppressionAmongAlhivEnrolledInOtzByAgeHandler implements IQueryHandler<GetOtzVlSuppressionAmongAlhivEnrolledInOtzByAgeQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }

    async execute(query: GetOtzVlSuppressionAmongAlhivEnrolledInOtzByAgeQuery): Promise<any> {
        const vlSuppressionOtzByAge = this.repository
            .createQueryBuilder('f')
            .select([
                '[AgeGroup] ageGroup, ValidVLResultCategory Last12MVLResult, SUM([HasValidVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND ValidVLResultCategory IS NOT NULL',
            );

        if (query.county) {
            vlSuppressionOtzByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionOtzByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionOtzByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionOtzByAge.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionOtzByAge.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzByAge.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionOtzByAge.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionOtzByAge
            .groupBy('[AgeGroup], ValidVLResultCategory')
            .orderBy('[AgeGroup]')
            .getRawMany();
    }
}
