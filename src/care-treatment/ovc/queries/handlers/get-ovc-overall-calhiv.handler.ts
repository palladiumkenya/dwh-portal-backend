import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOvcOverallCalHivQuery } from '../impl/get-ovc-overall-calhiv.query';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LineListOVCEnrollments } from './../../entities/linelist-ovc-enrollments.model';

@QueryHandler(GetOvcOverallCalHivQuery)
export class GetOvcOverallCalhivHandler implements IQueryHandler<GetOvcOverallCalHivQuery> {
    constructor(
        @InjectRepository(LineListOVCEnrollments, 'mssql')
        private readonly repository: Repository<LineListOVCEnrollments>
    ) {
    }

    async execute(query: GetOvcOverallCalHivQuery): Promise<any> {
        const overAllCalHiv = this.repository.createQueryBuilder('f')
            .select(['COUNT(*) overallCALHIV'])
            .andWhere('f.TXCurr = 1');

        if (query.county) {
            overAllCalHiv.andWhere('f.County IN (:...counties)', { counties: query.county });
        }

        if (query.subCounty) {
            overAllCalHiv.andWhere('f.SubCounty IN (:...subCounties)', { subCounties: query.subCounty });
        }

        if (query.facility) {
            overAllCalHiv.andWhere('f.FacilityName IN (:...facilities)', { facilities: query.facility });
        }

        if (query.partner) {
            overAllCalHiv.andWhere('f.PartnerName IN (:...partners)', { partners: query.partner });
        }

        if (query.agency) {
            overAllCalHiv.andWhere('f.AgencyName IN (:...agencies)', { agencies: query.agency });
        }

        if (query.gender) {
            overAllCalHiv.andWhere('f.Gender IN (:...genders)', { genders: query.gender });
        }

        if (query.datimAgeGroup) {
            overAllCalHiv.andWhere('f.DATIMAgeGroup IN (:...ageGroups)', { ageGroups: query.datimAgeGroup });
        }

        return await overAllCalHiv.getRawOne();
    }
}
