import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcEligibleVlQuery } from '../impl/get-ovc-eligible-vl.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcEligibleVlQuery)
export class GetOvcEligibleVlHandler implements IQueryHandler<GetOvcEligibleVlQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcEligibleVlQuery): Promise<any> {
        const OVCEligible = this.repository.createQueryBuilder('f')
            .select(['Count (*) OVCEligible'])
            .andWhere('f.TXCurr=1 and EligibleVL=1 and OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            OVCEligible.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            OVCEligible.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            OVCEligible.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            OVCEligible.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCEligible.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCEligible.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCEligible.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCEligible.getRawOne();
    }
}
