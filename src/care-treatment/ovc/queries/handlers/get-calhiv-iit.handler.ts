import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivIitQuery } from '../impl/get-calhiv-iit.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from '../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivIitQuery)
export class GetCalhivIitHandler implements IQueryHandler<GetCalhivIitQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetCalhivIitQuery): Promise<any> {
        const CALHIVonART = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) CALHIVIIT'])
            .andWhere(`f.ARTOutcomeDescription ='Undocumented Loss'`);

        if (query.county) {
            CALHIVonART.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVonART.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVonART.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVonART.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVonART.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            CALHIVonART.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            CALHIVonART.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await CALHIVonART.getRawOne();
    }
}
