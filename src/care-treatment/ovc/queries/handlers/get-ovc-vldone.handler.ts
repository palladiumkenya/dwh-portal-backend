import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcVldoneQuery } from '../impl/get-ovc-vldone.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcVldoneQuery)
export class GetOvcVldoneHandler implements IQueryHandler<GetOvcVldoneQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcVldoneQuery): Promise<any> {
        const OVCVLDone = this.repository.createQueryBuilder('f')
            .select(['Count (*)OVCVLDone'])
            .andWhere('f.TXCurr=1 and VLDone=1 and OVCEnrollmentDate IS NOT NULL');

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
            OVCVLDone.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCVLDone.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCVLDone.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCVLDone.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCVLDone.getRawOne();
    }
}
