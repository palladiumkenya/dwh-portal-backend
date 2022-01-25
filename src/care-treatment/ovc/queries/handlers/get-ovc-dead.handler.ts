import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcDeadQuery } from '../impl/get-ovc-dead.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcDeadQuery)
export class GetOvcDeadHandler implements IQueryHandler<GetOvcDeadQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcDeadQuery): Promise<any> {
        const OVCDead = this.repository.createQueryBuilder('f')
            .select(['Count (*)OVCDead'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and ARTOutcome=\'D\'');

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
            OVCDead.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCDead.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCDead.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCDead.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCDead.getRawOne();
    }
}
