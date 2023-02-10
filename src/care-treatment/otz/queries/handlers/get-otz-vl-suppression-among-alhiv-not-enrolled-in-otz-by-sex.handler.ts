import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzBySexQuery } from '../impl/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-sex.query';
import { AggregateOtz } from '../../entities/aggregate-otz.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzBySexQuery)
export class GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzBySexHandler
    implements
        IQueryHandler<GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzBySexQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>,
    ) {}

    async execute(
        query: GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzBySexQuery,
    ): Promise<any> {
        const vlSuppressionOtzBySex = this.repository
            .createQueryBuilder('f')
            .select([
                '[Gender], Last12MVLResult, SUM([Last12MonthVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND Last12MVLResult IS NOT NULL',
            );

        if (query.county) {
            vlSuppressionOtzBySex.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlSuppressionOtzBySex.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            vlSuppressionOtzBySex.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlSuppressionOtzBySex.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            vlSuppressionOtzBySex.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzBySex.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            vlSuppressionOtzBySex.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await vlSuppressionOtzBySex
            .groupBy('[Gender], Last12MVLResult')
            .orderBy('[Gender]')
            .getRawMany();
    }
}
