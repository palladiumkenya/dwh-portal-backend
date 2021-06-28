import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery } from '../impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-age.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery)
export class GetVlUptakeAmongAlhivEnrolledInOtzByAgeHandler implements IQueryHandler<GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetVlUptakeAmongAlhivEnrolledInOtzByAgeQuery): Promise<any> {
        const vlUptakeAmongAlHivEnrolledInOtzByAge = this.repository.createQueryBuilder('f')
            .select(['[DATIM_AgeGroup] ageGroup, COUNT([lastVL]) lastVL, SUM([EligibleVL]) eligibleVL, COUNT([lastVL]) * 100.0/ SUM([EligibleVL]) as vl_uptake_percent'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeAmongAlHivEnrolledInOtzByAge.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlUptakeAmongAlHivEnrolledInOtzByAge
            .groupBy('DATIM_AgeGroup')
            .getRawMany();
    }
}
