import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetCalhivVldoneQuery } from '../impl/get-calhiv-vldone.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOvcEnrollments } from '../../entities/fact-trans-ovc-enrollments.model';
import { Repository } from 'typeorm';
import { FactTransOtzOutcome } from '../../../otz/entities/fact-trans-otz-outcome.model';

@QueryHandler(GetCalhivVldoneQuery)
export class GetCalhivVldoneHandler implements IQueryHandler<GetCalhivVldoneQuery> {
    constructor(
        @InjectRepository(FactTransOvcEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzOutcome>
    ) {
    }

    async execute(query: GetCalhivVldoneQuery): Promise<any> {
        const CALHIVVLSuppressed = this.repository.createQueryBuilder('f')
            .select(['Count (*)CALHIVVLSuppressed'])
            .andWhere('f.TXCurr=1 and VirallySuppressed=1');

        if (query.county) {
            CALHIVVLSuppressed.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVVLSuppressed.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVVLSuppressed.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVVLSuppressed.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVVLSuppressed.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            CALHIVVLSuppressed.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            CALHIVVLSuppressed.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await CALHIVVLSuppressed.getRawOne();
    }
}
