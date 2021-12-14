import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetVlUptakeAmongAlhivEnrolledInOtzByPartnerQuery } from '../impl/get-vl-uptake-among-alhiv-enrolled-in-otz-by-partner.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetVlUptakeAmongAlhivEnrolledInOtzByPartnerQuery)
export class GetVlUptakeAmongAlhivEnrolledInOtzByPartnerHandler implements IQueryHandler<GetVlUptakeAmongAlhivEnrolledInOtzByPartnerQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetVlUptakeAmongAlhivEnrolledInOtzByPartnerQuery): Promise<any> {
        const vlUptakeAmongAlHivEnrolledInOtzByCounty = this.repository.createQueryBuilder('f')
            .select(['[CTPartner] partner, COUNT([lastVL]) lastVL, SUM([EligibleVL]) eligibleVL, COUNT([lastVL]) * 100.0/ SUM([EligibleVL]) as vl_uptake_percent'])
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

        if (query.agency) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            vlUptakeAmongAlHivEnrolledInOtzByCounty.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await vlUptakeAmongAlHivEnrolledInOtzByCounty
            .groupBy('CTPartner')
            .getRawMany();
    }
}
