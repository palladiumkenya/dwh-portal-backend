import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcIITQuery } from '../impl/get-ovc-iit.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetOvcIITQuery)
export class GetOvcIITHandler implements IQueryHandler<GetOvcIITQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetOvcIITQuery): Promise<any> {
        const OVCIIT = this.repository.createQueryBuilder('f')
            .select(['Count (*)OVCIIT'])
            .andWhere('f.OVCEnrollmentDate IS NOT NULL and ARTOutcome=\'uL\'');

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
            OVCIIT.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            OVCIIT.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            OVCIIT.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            OVCIIT.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await OVCIIT.getRawOne();
    }
}
