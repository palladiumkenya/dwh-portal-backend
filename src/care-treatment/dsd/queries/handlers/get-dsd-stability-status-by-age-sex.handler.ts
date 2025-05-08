import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetDsdStabilityStatusByAgeSexQuery } from '../impl/get-dsd-stability-status-by-age-sex.query';
import { AggregateDSD } from '../../entities/AggregateDSD.model';

@QueryHandler(GetDsdStabilityStatusByAgeSexQuery)
export class GetDsdStabilityStatusByAgeSexHandler implements IQueryHandler<GetDsdStabilityStatusByAgeSexQuery> {
    constructor(
        @InjectRepository(AggregateDSD, 'mssql')
        private readonly repository: Repository<AggregateDSD>,
    ) {}

    async execute(query: GetDsdStabilityStatusByAgeSexQuery): Promise<any> {
        const dsdStabilityStatusByAgeSex = this.repository
            .createQueryBuilder('f')
            .select([
                '[AgeGroup] ageGroup, SUM([TXCurr]) patients, SUM(TXCurr) TXCurr, Sex gender',
            ])
            .andWhere('f.StabilityAssessment = :stability', {
                stability: 'Stable',
            });

        if (query.county) {
            dsdStabilityStatusByAgeSex.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            dsdStabilityStatusByAgeSex.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            dsdStabilityStatusByAgeSex.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            dsdStabilityStatusByAgeSex.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            dsdStabilityStatusByAgeSex.andWhere(
                'f.AgencyName IN (:...agencies)',
                { agencies: query.agency },
            );
        }

        if (query.datimAgeGroup) {
            dsdStabilityStatusByAgeSex.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            dsdStabilityStatusByAgeSex.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await dsdStabilityStatusByAgeSex
            .groupBy('f.AgeGroup, f.Sex')
            .orderBy('f.AgeGroup, f.Sex')
            .getRawMany();
    }
}
