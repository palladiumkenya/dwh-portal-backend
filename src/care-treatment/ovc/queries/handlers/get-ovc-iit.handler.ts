import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcIITQuery } from '../impl/get-ovc-iit.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcIITQuery)
export class GetOvcIITHandler implements IQueryHandler<GetOvcIITQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcIITQuery): Promise<any> {
        const OVCIIT = this.repository
            .createQueryBuilder('f')
            .select(['Count (*) OVCIIT'])
            .andWhere(
                `f.OVCEnrollmentDate IS NOT NULL and ARTOutcomeDescription ='Undocumented Loss'`,
            );

        if (query.county) {
            OVCIIT.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            OVCIIT.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            OVCIIT.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            OVCIIT.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCIIT.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCIIT.andWhere('f.Sex IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCIIT.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCIIT.getRawOne();
    }
}
