import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivDeadQuery } from '../impl/get-calhiv-dead.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from '../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivDeadQuery)
export class GetCalhivDeadHandler implements IQueryHandler<GetCalhivDeadQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }
//todo:: Something about linlist and agg dont match up
    async execute(query: GetCalhivDeadQuery): Promise<any> {
        const CALHIVonART = this.repository
            .createQueryBuilder('f')
            .select(['COUNT (*) CALHIVDead'])
            .andWhere("f.ARTOutcomeDescription='Dead'");

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
