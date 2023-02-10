import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery } from '../impl/get-otz-vl-suppression-among-alhiv-not-enrolled-in-otz-by-partner.query';
import { AggregateOtz } from '../../entities/aggregate-otz.model';

@QueryHandler(GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery)
export class GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerHandler
    implements
        IQueryHandler<
            GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery
        > {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>,
    ) {}

    async execute(
        query: GetOtzVlSuppressionAmongAlhivNotEnrolledInOtzByPartnerQuery,
    ): Promise<any> {
        const vlSuppressionOtzByPartner = this.repository
            .createQueryBuilder('f')
            .select([
                '[PartnerName] CTPartner, Last12MVLResult, SUM([Last12MonthVL]) AS vlSuppression',
            ])
            .andWhere(
                'f.MFLCode IS NOT NULL AND Last12MVLResult IS NOT NULL',
            );

        if (query.county) {
            vlSuppressionOtzByPartner.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            vlSuppressionOtzByPartner.andWhere(
                'f.SubCounty IN (:...subCounties)',
                { subCounties: query.subCounty },
            );
        }

        if (query.facility) {
            vlSuppressionOtzByPartner.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            vlSuppressionOtzByPartner.andWhere(
                'f.PartnerName IN (:...partners)',
                { partners: query.partner },
            );
        }

        if (query.agency) {
            vlSuppressionOtzByPartner.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            vlSuppressionOtzByPartner.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            vlSuppressionOtzByPartner.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await vlSuppressionOtzByPartner
            .groupBy('[PartnerName], Last12MVLResult')
            .orderBy('[PartnerName]')
            .getRawMany();
    }
}
