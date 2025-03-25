import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzAdolescentsEnrolledByCountyQuery } from '../impl/get-otz-adolescents-enrolled-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOTZEligibilityAndEnrollments } from '../../entities/line-list-otz-eligibility-and-enrollments.model';

@QueryHandler(GetOtzAdolescentsEnrolledByCountyQuery)
export class GetOtzAdolescentsEnrolledByCountyHandler
    implements IQueryHandler<GetOtzAdolescentsEnrolledByCountyQuery> {
    constructor(
        @InjectRepository(LineListOTZEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<
            LineListOTZEligibilityAndEnrollments
        >,
    ) {}

    async execute(query: GetOtzAdolescentsEnrolledByCountyQuery): Promise<any> {
        const otzEnrollmentsCounty = this.repository
            .createQueryBuilder('f')
            .select(['County, COUNT(*) totalAdolescents']);

        if (query.county) {
            otzEnrollmentsCounty.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            otzEnrollmentsCounty.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            otzEnrollmentsCounty.andWhere(
                'f.FacilityName IN (:...facilities)',
                { facilities: query.facility },
            );
        }

        if (query.partner) {
            otzEnrollmentsCounty.andWhere('f.PartnerName IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            otzEnrollmentsCounty.andWhere('f.AgencyName IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsCounty.andWhere('f.AgeGroup IN (:...ageGroups)', {
                ageGroups: query.datimAgeGroup,
            });
        }

        if (query.gender) {
            otzEnrollmentsCounty.andWhere('f.Sex IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await otzEnrollmentsCounty.groupBy('County').getRawMany();
    }
}
