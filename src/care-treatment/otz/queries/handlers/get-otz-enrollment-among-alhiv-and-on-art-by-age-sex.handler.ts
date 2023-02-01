import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-age-sex.query';
import { AggregateOtz } from './../../entities/aggregate-otz.model';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexHandler
    implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery> {
    constructor(
        @InjectRepository(AggregateOtz, 'mssql')
        private readonly repository: Repository<AggregateOtz>,
    ) {}

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery) {
        const otzEnrollmentsByAge = this.repository
            .createQueryBuilder('f')
            .select([
                '[AgeGroup] ageGroup, Gender, SUM(Enrolled) TXCurr',
            ])

        if (query.county) {
            otzEnrollmentsByAge.andWhere('f.County IN (:...counties)', {
                counties: query.county,
            });
        }

        if (query.subCounty) {
            otzEnrollmentsByAge.andWhere('f.SubCounty IN (:...subCounties)', {
                subCounties: query.subCounty,
            });
        }

        if (query.facility) {
            otzEnrollmentsByAge.andWhere('f.FacilityName IN (:...facilities)', {
                facilities: query.facility,
            });
        }

        if (query.partner) {
            otzEnrollmentsByAge.andWhere('f.CTPartner IN (:...partners)', {
                partners: query.partner,
            });
        }

        if (query.agency) {
            otzEnrollmentsByAge.andWhere('f.CTAgency IN (:...agencies)', {
                agencies: query.agency,
            });
        }

        if (query.datimAgeGroup) {
            otzEnrollmentsByAge.andWhere(
                'f.AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            otzEnrollmentsByAge.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await otzEnrollmentsByAge
            .groupBy('AgeGroup, Gender')
            .orderBy('AgeGroup')
            .getRawMany();
    }
}
