import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcOnArtQuery } from '../impl/get-ovc-on-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcOnArtQuery)
export class GetOvcOnArtHandler implements IQueryHandler<GetOvcOnArtQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcOnArtQuery): Promise<any> {
        const OVConART = this.repository.createQueryBuilder('f')
            .select(['Count (*) OVConART'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and f.TXCurr=1');

        if (query.county) {
            OVConART.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            OVConART.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            OVConART.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            OVConART.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVConART.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVConART.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVConART.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVConART.getRawOne();
    }
}
