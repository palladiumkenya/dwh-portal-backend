import { InjectRepository } from '@nestjs/typeorm';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Repository } from 'typeorm';
import { GetVlSuppressionByAgeQuery } from '../impl/get-vl-suppression-by-age.query';
import { LinelistFACTART } from '../../../common/entities/linelist-fact-art.model';

@QueryHandler(GetVlSuppressionByAgeQuery)
export class GetVlSuppressionByAgeHandler
    implements IQueryHandler<GetVlSuppressionByAgeQuery> {
    constructor(
        @InjectRepository(LinelistFACTART, 'mssql')
        private readonly repository: Repository<LinelistFACTART>,
    ) {}

    async execute(query: GetVlSuppressionByAgeQuery): Promise<any> {
        const vlSuppressionByAge = this.repository
            .createQueryBuilder('f')
            .select([
                'f.AgeGroup ageGroup, f.ValidVLResultCategory2 suppression, count(f.ValidVLResult) vlDone',
            ])
            .where('f.SiteCode > 0')
            .andWhere('f.AgeGroup IS NOT NULL')
            .andWhere('f.isTXCurr > 0')
            .andWhere('f.ValidVLResultCategory2 IS NOT NULL');

        if (query.county) {
            vlSuppressionByAge.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlSuppressionByAge.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlSuppressionByAge.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            vlSuppressionByAge.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlSuppressionByAge.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlSuppressionByAge.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            vlSuppressionByAge.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await vlSuppressionByAge
            .groupBy('f.AgeGroup, f.ValidVLResultCategory2')
            .orderBy('f.AgeGroup, f.ValidVLResultCategory2')
            .getRawMany();
    }
}
