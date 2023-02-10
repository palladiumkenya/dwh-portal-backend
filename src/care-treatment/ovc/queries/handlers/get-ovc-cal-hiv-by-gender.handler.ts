import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcCalHIVByGenderQuery } from '../impl/get-ovc-cal-hiv-by-gender.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcCalHIVByGenderQuery)
export class GetOvcCalHIVByGenderHandler implements IQueryHandler<GetOvcCalHIVByGenderQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcCalHIVByGenderQuery): Promise<any> {
        const calHIVByGender = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) CALHIV, Gender'])
            .andWhere('f.TXCurr = 1');

        if (query.county) {
            calHIVByGender.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            calHIVByGender.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            calHIVByGender.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            calHIVByGender.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            calHIVByGender.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            calHIVByGender.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            calHIVByGender.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await calHIVByGender.groupBy('Gender').getRawMany();
    }
}
