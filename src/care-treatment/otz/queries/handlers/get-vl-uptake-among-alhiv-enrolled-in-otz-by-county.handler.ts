import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery } from '../impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-county.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery)
export class GetVlUptakeAmongAlhivEnrolledInOtzByCountyHandler implements IQueryHandler<GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetVlUptakeAmongAlhivEnrolledInOtzByCountyQuery): Promise<any> {
        const vlUptakeAmongAlHivEnrolledInOtzByCounty = this.repository.createQueryBuilder('f')
            .select(['[County], COUNT([lastVL]) lastVL, SUM([EligibleVL]) eligibleVL, COUNT([lastVL]) * 100.0/ SUM([EligibleVL]) as vl_uptake_percent'])
            .andWhere('f.OTZEnrollmentDate IS NOT NULL');

        if (query.county) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        return await vlUptakeAmongAlHivEnrolledInOtzByCounty
            .groupBy('County')
            .getRawMany();
    }
}
