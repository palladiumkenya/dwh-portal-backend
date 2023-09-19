import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivOnDtgQuery } from '../impl/get-calhiv-on-dtg.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEligibilityAndEnrollments } from '../../entities/linelist-ovc-eligibility-and-enrollments.model';

@QueryHandler(GetCalhivOnDtgQuery)
export class GetCalhivOnDtgNotInOvcHandler implements IQueryHandler<GetCalhivOnDtgQuery> {
    constructor(
        @InjectRepository(LineListOVCEligibilityAndEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEligibilityAndEnrollments>
    ) {
    }

    async execute(query: GetCalhivOnDtgQuery): Promise<any> {
        const CALHIVonDTG = this.repository.createQueryBuilder('f')
            .select(['Count (*) CALHIVonDTG'])
            .andWhere('f.LastRegimen <>\'non DTG\' AND f.OVCEnrollmentDate IS NULL and TXCurr=1');

        if (query.county) {
            CALHIVonDTG.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVonDTG.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVonDTG.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVonDTG.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVonDTG.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            CALHIVonDTG.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            CALHIVonDTG.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await CALHIVonDTG.getRawOne();
    }
}
