import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivVirallySuppressedQuery } from '../impl/get-calhiv-virally-suppressed.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEligibilityAndEnrollments } from '../../entities/linelist-ovc-eligibility-and-enrollments.model';

@QueryHandler(GetCalhivVirallySuppressedQuery)
export class GetCalhivVirallySuppressedNotInOvcHandler implements IQueryHandler<GetCalhivVirallySuppressedQuery> {
    constructor(
        @InjectRepository(LineListOVCEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEligibilityAndEnrollments>
    ) {
    }

    async execute(query: GetCalhivVirallySuppressedQuery): Promise<any> {
        const CALHIVVLSuppressed = this.repository.createQueryBuilder('f')
            .select(['Count (*) CALHIVVLSuppressed'])
            .andWhere('f.TXCurr=1 and VirallySuppressed=1 and f.OVCEnrollmentDate IS NULL');

        if (query.county) {
            CALHIVVLSuppressed.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVVLSuppressed.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVVLSuppressed.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVVLSuppressed.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVVLSuppressed.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            CALHIVVLSuppressed.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            CALHIVVLSuppressed.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await CALHIVVLSuppressed.getRawOne();
    }
}
