import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcVirallySuppressedQuery } from '../impl/get-ovc-virally-suppressed.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcVirallySuppressedQuery)
export class GetOvcVirallySuppressedHandler implements IQueryHandler<GetOvcVirallySuppressedQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcVirallySuppressedQuery): Promise<any> {
        const OVCVLSuppressed = this.repository.createQueryBuilder('f')
            .select(['Count (*)OVCVLSuppressed'])
            .andWhere('f.TXCurr=1 and VirallySuppressed=1 and OVCEnrollmentDate IS NOT NULL');

        if (query.county) {
            OVCVLSuppressed.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            OVCVLSuppressed.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            OVCVLSuppressed.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            OVCVLSuppressed.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCVLSuppressed.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCVLSuppressed.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCVLSuppressed.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCVLSuppressed.getRawOne();
    }
}
