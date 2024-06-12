import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery } from '../impl/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-age.query';
import { LineListOTZEligibilityAndEnrollments } from './../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery)
export class GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeHandler
    implements
        IQueryHandler<GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOTZEligibilityAndEnrollments>,
    ) {}
    // TODO:: Move to correct table
    async execute(
        query: GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery,
    ): Promise<any> {
        let vlSuppressionOtzByAgeAlhiv = this.repository
            .createQueryBuilder('f')
            .select([
                '[AgeGroup] ageGroup, ValidVLResultCategory2 Last12MVLResult, SUM([HasValidVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND ValidVLResultCategory2 IS NOT NULL AND Enrolled = 0',
            );

        if (query.county) {
            vlSuppressionOtzByAgeAlhiv.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlSuppressionOtzByAgeAlhiv.andWhere(
                'f.SubCounty IN (:...subCounties)',
                {
                    subCounties: query.subCounty,
                },
            );
        }

        if (query.facility) {
            vlSuppressionOtzByAgeAlhiv.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlSuppressionOtzByAgeAlhiv.andWhere(
                'f.PartnerName IN (:...partners)',
                {
                    partners: query.partner,
                },
            );
        }

        if (query.agency) {
            vlSuppressionOtzByAgeAlhiv.andWhere(
                'f.AgencyName IN (:...agencies)',
                {
                    agencies: query.agency,
                },
            );
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzByAgeAlhiv.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            vlSuppressionOtzByAgeAlhiv.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await vlSuppressionOtzByAgeAlhiv
            .groupBy('[AgeGroup], ValidVLResultCategory2')
            .orderBy('[AgeGroup]')
            .getRawMany();
    }
}
