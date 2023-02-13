import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzAdolescentsEnrolledByPartnerQuery } from '../impl/get-otz-adolescents-enrolled-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOtzAdolescentsEnrolledByPartnerQuery)
export class GetOtzAdolescentsEnrolledByPartnerHandler
    implements IQueryHandler<GetOtzAdolescentsEnrolledByPartnerQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<
            LineListOTZEligibilityAndEnrollments
        >,
    ) {}

    async execute(
        query: GetOtzAdolescentsEnrolledByPartnerQuery,
    ): Promise<any> {
        const otzEnrollmentsPartner = this.repository
            .createQueryBuilder('f')
            .select(['[PartnerName] partner, COUNT(*) totalAdolescents']);

        if (query.county) {
            otzEnrollmentsPartner.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            otzEnrollmentsPartner.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            otzEnrollmentsPartner.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            otzEnrollmentsPartner.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            otzEnrollmentsPartner.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsPartner.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            otzEnrollmentsPartner.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await otzEnrollmentsPartner.groupBy('PartnerName').getRawMany();
    }
}
