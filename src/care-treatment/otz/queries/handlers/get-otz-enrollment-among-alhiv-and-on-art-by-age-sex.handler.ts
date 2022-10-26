import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';
import { GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery } from '../impl/get-otz-enrollment-among-alhiv-and-on-art-by-age-sex.query';

@QueryHandler(GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery)
export class GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexHandler
    implements IQueryHandler<GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>,
    ) {}

    async execute(query: GetOtzEnrollmentAmongAlhivAndOnArtByAgeSexQuery) {
        const otzEnrollmentsByAge = this.repository
            .createQueryBuilder('f')
            .select([
                '[DATIM_AgeGroup] ageGroup, Gender, SUM([TXCurr]) TXCurr',
            ])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

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
                'f.DATIM_AgeGroup IN (:...ageGroups)',
                { ageGroups: query.datimAgeGroup },
            );
        }

        if (query.gender) {
            otzEnrollmentsByAge.andWhere('f.Gender IN (:...genders)', {
                genders: query.gender,
            });
        }

        return await otzEnrollmentsByAge
            .groupBy('DATIM_AgeGroup, Gender')
            .orderBy('DATIM_AgeGroup')
            .getRawMany();
    }
}
