import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery } from '../impl/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-age.query';
import { LineListALHIV } from './../../entities/line-list-alhiv.model';
import { LineListOTZ } from './../../entities/line-list-otz.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery)
export class GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeHandler
    implements
        IQueryHandler<GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery> {
    constructor(
        @InjectRepository(LineListALHIV, 'mssql')
        private readonly repository: Repository<LineListALHIV>,
        @InjectRepository(LineListOTZ, 'mssql')
        private readonly repository2: Repository<LineListOTZ>,
    ) {}
// TODO:: Move to correct table
    async execute(
        query: GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByAgeQuery,
    ): Promise<any> {
                        let vlSuppressionOtzByAgeAlhiv = this.repository
                            .createQueryBuilder('f')
                            .select([
                                '[AgeGroup] ageGroup, Last12MVLResult, SUM([Last12MonthVL]) AS vlSuppression',
                            ])
                            .andWhere(
                                'f.MFLCode IS NOT NULL AND Last12MVLResult IS NOT NULL',
                            );

                        let vlSuppressionOtzByAge = this.repository2
                            .createQueryBuilder('f')
                            .select([
                                '[AgeGroup] ageGroup, Last12MVLResult, SUM([Last12MonthVL]) AS vlSuppression',
                            ])
                            .andWhere(
                                'f.MFLCode IS NOT NULL AND Last12MVLResult IS NOT NULL',
                            );

                        if (query.county) {
                            vlSuppressionOtzByAgeAlhiv.andWhere(
                                'f.County IN (:...counties)',
                                {
                                    counties: query.county,
                                },
                            );
                            vlSuppressionOtzByAge.andWhere(
                                'f.County IN (:...counties)',
                                {
                                    counties: query.county,
                                },
                            );
                        }

                        if (query.subCounty) {
                            vlSuppressionOtzByAgeAlhiv.andWhere(
                                'f.SubCounty IN (:...subCounties)',
                                {
                                    subCounties: query.subCounty,
                                },
                            );
                            vlSuppressionOtzByAge.andWhere(
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
                            vlSuppressionOtzByAge.andWhere(
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
                            vlSuppressionOtzByAge.andWhere(
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
                            vlSuppressionOtzByAge.andWhere(
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
                            vlSuppressionOtzByAge.andWhere(
                                'f.AgeGroup IN (:...ageGroups)',
                                { ageGroups: query.datimAgeGroup },
                            );
                        }

                        if (query.gender) {
                            vlSuppressionOtzByAgeAlhiv.andWhere(
                                'f.Gender IN (:...genders)',
                                {
                                    genders: query.gender,
                                },
                            );
                            vlSuppressionOtzByAge.andWhere(
                                'f.Gender IN (:...genders)',
                                {
                                    genders: query.gender,
                                },
                            );
                        }

                        let vlSuppressionOtz = await vlSuppressionOtzByAge
                            .groupBy('[AgeGroup], Last12MVLResult')
                            .orderBy('[AgeGroup]')
                            .getRawMany();

                        let vlSuppressionAlhiv = await vlSuppressionOtzByAgeAlhiv
                            .groupBy('[AgeGroup], Last12MVLResult')
                            .orderBy('[AgeGroup]')
                            .getRawMany();

                        const counts = [];
                        for (const enrolled of vlSuppressionOtz) {
                            const notEnrolled = vlSuppressionAlhiv.find(
                                count => count.County === enrolled.County,
                            );
                            counts.push({
                                County: enrolled.County,
                                Enrolled: enrolled.Enrolled,
                                NotEnrolled: notEnrolled
                                    ? notEnrolled.NotEnrolled
                                    : 0,
                            });
                        }

                        return counts.map(count => ({
                            ...count,
                            Difference: count.Enrolled - count.NotEnrolled,
                        }));
                    }
}
