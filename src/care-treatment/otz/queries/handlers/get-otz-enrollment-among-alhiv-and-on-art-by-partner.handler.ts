import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { AggregateOtz } from './../../entities/aggregate-otz.model';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtByPartnerHandler implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>
    ) {
    }

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtByPartnerQuery) {
        const otzEnrollmentsPartner = this.repository
            .createQueryBuilder('f')
            .select([
                '[CTPartner] partner, SUM(CompletedTraining) count_training, SUM(Enrolled) TXCurr, SUM(Enrolled) * 100.0 / SUM(SUM(Enrolled)) OVER () AS Percentage',
            ]);

        if (query.county) {
            otzEnrollmentsPartner.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrollmentsPartner.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrollmentsPartner.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrollmentsPartner.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzEnrollmentsPartner.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsPartner.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzEnrollmentsPartner.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzEnrollmentsPartner
            .groupBy('CTPartner')
            .getRawMany();
    }
}
