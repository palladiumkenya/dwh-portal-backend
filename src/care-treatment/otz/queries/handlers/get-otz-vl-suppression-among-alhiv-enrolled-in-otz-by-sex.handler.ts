import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery } from '../impl/get-otz-vl-suppression-among-alhiv-enrolled-in-otz-by-sex.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZ } from '../../entities/line-list-otz.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery)
export class GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexHandler implements IQueryHandler<GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery> {
    constructor(
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository: Repository<LineListOTZ>
    ) {
    }

    async execute(query: GetOtzVlSuppressionAmongAlhivEnrolledInOtzBySexQuery): Promise<any> {
        const vlSuppressionOtzBySex = this.repository
            .createQueryBuilder('f')
            .select([
                'Sex Gender, ValidVLResultCategory Last12MVLResult, SUM([HasValidVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND ValidVLResultCategory IS NOT NULL',
            );

        if (query.county) {
            vlSuppressionOtzBySex.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlSuppressionOtzBySex.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlSuppressionOtzBySex.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlSuppressionOtzBySex.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            vlSuppressionOtzBySex.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzBySex.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlSuppressionOtzBySex.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        return await vlSuppressionOtzBySex
            .groupBy('[Sex], ValidVLResultCategory')
            .orderBy('[Sex]')
            .getRawMany();
    }
}
