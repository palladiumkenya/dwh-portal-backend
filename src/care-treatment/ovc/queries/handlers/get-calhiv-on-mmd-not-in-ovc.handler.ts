import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivOnMmdQuery } from '../impl/get-calhiv-on-mmd.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetCalhivOnMmdQuery)
export class GetCalhivOnMmdNotInOvcHandler implements IQueryHandler<GetCalhivOnMmdQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetCalhivOnMmdQuery): Promise<any> {
        const CALHIVonMMD = this.repository.createQueryBuilder('f')
            .select(['Count (*) CALHIVonMMD'])
            .andWhere('f.onMMD=1 and f.TXCurr=1 and f.OVCEnrollmentDate IS NULL');

        if (query.county) {
            CALHIVonMMD.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVonMMD.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVonMMD.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVonMMD.andWhere('f.PartnerNameme IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVonMMD.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            CALHIVonMMD.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            CALHIVonMMD.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await CALHIVonMMD.getRawOne();
    }
}
