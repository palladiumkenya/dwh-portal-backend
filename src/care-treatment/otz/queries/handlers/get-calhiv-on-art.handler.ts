import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOTZCalhivOnArtQuery } from '../impl/get-calhiv-on-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { FactTransOtzEnrollments } from '../../entities/fact-trans-otz-enrollments.model';
import { Repository } from 'typeorm';

@QueryHandler(GetOTZCalhivOnArtQuery)
export class GetOTZCalhivOnArtHandler implements IQueryHandler<GetOTZCalhivOnArtQuery> {
    constructor(
        @InjectRepository(FactTransOtzEnrollments, 'mssql')
        private readonly repository: Repository<FactTransOtzEnrollments>
    ) {
    }

    async execute(query: GetOTZCalhivOnArtQuery): Promise<any> {
        const CALHIVOnART = this.repository.createQueryBuilder('f')
            .select(['Count (*)CALHIVonART'])
            .andWhere('f.TXCurr = 1');

        if (query.county) {
            CALHIVOnART.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            CALHIVOnART.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            CALHIVOnART.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            CALHIVOnART.andWhere('f.CTPartner IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            CALHIVOnART.andWhere('f.CTAgency IN (:...agencies)', { agencies: query.agency });
        }

        if (query.datimAgeGroup) {
            CALHIVOnART.andWhere('f.DATIM_AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            CALHIVOnART.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await CALHIVOnART.getRawOne();
    }
}
