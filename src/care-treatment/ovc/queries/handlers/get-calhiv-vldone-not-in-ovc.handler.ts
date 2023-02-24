import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivVldoneQuery } from '../impl/get-calhiv-vldone.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from '../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivVldoneQuery)
export class GetCalhivVldoneNotInOvcHandler implements IQueryHandler<GetCalhivVldoneQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetCalhivVldoneQuery): Promise<any> {
        const CALHIVVLDone = this.repository.createQueryBuilder('f')
            .select(['Count (*) CALHIVVLDone'])
            .andWhere('f.TXCurr=1 and VLDone=1 and f.OVCEnrollmentDate IS NULL');

        if (query.county) {
            CALHIVVLDone.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVVLDone.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVVLDone.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVVLDone.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVVLDone.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            CALHIVVLDone.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            CALHIVVLDone.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await CALHIVVLDone.getRawOne();
    }
}
