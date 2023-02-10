import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrollmentAmongAlhivAndOnArtByAgeQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { AggregateOtz } from './../../entities/aggregate-otz.model';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtByAgeQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtByAgeHandler implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtByAgeQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>
    ) {
    }

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtByAgeQuery) {
        const otzEnrollmentsByAge = this.repository
            .createQueryBuilder('f')
            .select([
                '[AgeGroup] ageGroup, SUM(Enrolled) TXCurr, SUM(Enrolled) * 100.0 / SUM(SUM(Enrolled)) OVER () AS Percentage',
            ]);

        if (query.county) {
            otzEnrollmentsByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrollmentsByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrollmentsByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrollmentsByAge.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzEnrollmentsByAge.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsByAge.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzEnrollmentsByAge.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzEnrollmentsByAge
            .groupBy('AgeGroup')
            .orderBy('AgeGroup')
            .getRawMany();
    }
}
