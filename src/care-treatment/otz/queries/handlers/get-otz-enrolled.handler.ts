import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOtzEnrolledQuery } from '../impl/get-otz-enrolled.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOtzEnrolledQuery)
export class GetOtzEnrolledHandler implements IQueryHandler<GetOtzEnrolledQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOtzEnrolledQuery): Promise<any> {
        const otzEnrolled = this.repository.createQueryBuilder('f')
            .select(['count(*) enrolledInOTZ'])
            .where('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            otzEnrolled.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            otzEnrolled.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            otzEnrolled.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            otzEnrolled.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            otzEnrolled.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            otzEnrolled.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            otzEnrolled.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await otzEnrolled.getRawOne();
    }
}
