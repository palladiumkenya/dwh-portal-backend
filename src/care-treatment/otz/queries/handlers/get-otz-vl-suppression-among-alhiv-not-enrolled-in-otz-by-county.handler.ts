import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByCountyQuery } from '../impl/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-county.query';
import { LineListOTZEligibilityAndEnrollments } from './../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByCountyQuery)
export class GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByCountyHandler
    implements
        IQueryHandler<
            GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByCountyQuery
        > {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<
            LineListOTZEligibilityAndEnrollments
        >,
    ) {}

    async execute(
        query: GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByCountyQuery,
    ): Promise<any> {
        const vlSuppressionOtzByCounty = this.repository
            .createQueryBuilder('f')
            .select([
                '[County], ValidVLResultCategory Last12MVLResult, SUM([HasValidVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND ValidVLResultCategory IS NOT NULL AND Enrolled = 0',
            );

        if (query.county) {
            vlSuppressionOtzByCounty.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlSuppressionOtzByCounty.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            vlSuppressionOtzByCounty.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlSuppressionOtzByCounty.andWhere(
                'f.PartnerName IN (:...partners)',
                {
                    partners: query.partner,
                },
            );
        }

        if (query.agency) {
            vlSuppressionOtzByCounty.andWhere(
                'f.AgencyName IN (:...agencies)',
                {
                    agencies: query.agency,
                },
            );
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzByCounty.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            vlSuppressionOtzByCounty.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await vlSuppressionOtzByCounty
            .groupBy('[County], ValidVLResultCategory')
            .orderBy('[County]')
            .getRawMany();
    }
}
