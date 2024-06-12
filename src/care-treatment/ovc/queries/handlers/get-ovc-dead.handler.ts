import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDeadQuery } from '../impl/get-ovc-dead.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcDeadQuery)
export class GetOvcDeadHandler implements IQueryHandler<GetOvcDeadQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcDeadQuery): Promise<any> {
        const OVCDead = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) OVCDead'])
            .andWhere(
                "f.OVCEnrollmentDate IS NOT NULL and ARTOutcomeDescription='Dead'",
            );

        if (query.county) {
            OVCDead.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            OVCDead.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            OVCDead.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            OVCDead.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCDead.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCDead.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCDead.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCDead.getRawOne();
    }
}
