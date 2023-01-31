import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOTZCalhivOnArtQuery } from '../impl/get-calhiv-on-art.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListALHIV } from './../../entities/line-list-alhiv.model';

@QueryHandler(GetOTZCalhivOnArtQuery)
export class GetOTZCalhivOnArtHandler implements IQueryHandler<GetOTZCalhivOnArtQuery> {
    constructor(
        @InjectRepository(LineListALHIV, 'mssql')
        private readonly repository: Repository<LineListALHIV>
    ) {
    }

    async execute(query: GetOTZCalhivOnArtQuery): Promise<any> {
        const CALHIVOnART = this.repository.createQueryBuilder('f')
            .select(['Count (*) CALHIVonART'])

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
            CALHIVOnART.andWhere('f.AgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        if (query.gender) {
            CALHIVOnART.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        return await CALHIVOnART.getRawOne();
    }
}
