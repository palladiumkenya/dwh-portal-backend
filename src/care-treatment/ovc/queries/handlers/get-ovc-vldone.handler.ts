import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcVldoneQuery } from '../impl/get-ovc-vldone.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcVldoneQuery)
export class GetOvcVldoneHandler implements IQueryHandler<GetOvcVldoneQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcVldoneQuery): Promise<any> {
        const OVCVLDone = this.repository.createQueryBuilder('f')
            .select(['Count (*) OVCVLDone'])
            .andWhere('f.TXCurr=1 and HasValidVL=1 and OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            OVCVLDone.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            OVCVLDone.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            OVCVLDone.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            OVCVLDone.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCVLDone.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCVLDone.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCVLDone.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCVLDone.getRawOne();
    }
}
